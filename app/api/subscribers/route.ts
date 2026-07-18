import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mailer";
import { signToken } from "@/app/lib/token";
import { subscriptionConfirmationEmail } from "@/app/lib/emailTemplate";
import { getSubscriberCollection } from "@/app/lib/models/subscriber";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Rate limiting (in-memory, per IP)
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

// ---------------------------------------------------------------------------
// XSS sanitization
// ---------------------------------------------------------------------------

function sanitize(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  // Rate limiting
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, categoryIds } = body as Record<string, unknown>;

  // Validate
  const rawName = typeof name === "string" ? name.trim() : "";
  const rawEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!rawName) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
  }

  if (!emailRegex.test(rawEmail)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  // Validate categoryIds
  const validCategoryIds: number[] = [];
  if (Array.isArray(categoryIds)) {
    for (const id of categoryIds) {
      if (typeof id === "number" && Number.isInteger(id) && id > 0) {
        validCategoryIds.push(id);
      }
    }
  }

  if (validCategoryIds.length === 0) {
    return NextResponse.json(
      { error: "Please select at least one job category." },
      { status: 400 }
    );
  }

  // Sanitize
  const sanitizedName = sanitize(rawName);
  const sanitizedEmail = sanitize(rawEmail);

  try {
    const collection = await getSubscriberCollection();
    const existing = await collection.findOne({ email: sanitizedEmail });

    if (existing) {
      if (existing.status === "subscribed") {
        return NextResponse.json({ message: "You are already subscribed." }, { status: 409 });
      }

      // Re-subscribe a previously unsubscribed user
      await collection.updateOne(
        { email: sanitizedEmail },
        {
          $set: { name: sanitizedName, status: "subscribed", categoryIds: validCategoryIds },
          $unset: { unsubscribedAt: "" },
        }
      );
    } else {
      await collection.insertOne({
        name: sanitizedName,
        email: sanitizedEmail,
        status: "subscribed",
        categoryIds: validCategoryIds,
        createdAt: new Date(),
      });
    }

    // Send confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
    const unsubscribeToken = signToken(sanitizedEmail);
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${unsubscribeToken}`;

    try {
      await sendEmail({
        to: sanitizedEmail,
        subject: "You're subscribed to Code Quests Job Alerts!",
        html: subscriptionConfirmationEmail({ name: sanitizedName, unsubscribeUrl }),
      });
    } catch (err) {
      console.error("[/api/subscribers] Failed to send confirmation email:", err);
    }

    return NextResponse.json({ message: "Thanks for subscribing!" }, { status: 201 });
  } catch (error) {
    console.error("[/api/subscribers] Database error:", error);
    return NextResponse.json(
      { error: "Unable to save your subscription. Please try again later." },
      { status: 500 }
    );
  }
}
