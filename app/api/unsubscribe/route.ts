import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/token";
import { getSubscriberCollection } from "@/app/lib/models/subscriber";
import { sendEmail } from "@/app/lib/mailer";
import { unsubscriptionConfirmationEmail } from "@/app/lib/emailTemplate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${baseUrl}?status=invalid`);
  }

  const email = verifyToken(token);
  if (!email) {
    return NextResponse.redirect(`${baseUrl}?status=invalid`);
  }

  try {
    const collection = await getSubscriberCollection();

    const subscriber = await collection.findOne({ email });
    if (!subscriber) {
      return NextResponse.redirect(`${baseUrl}?status=not-found`);
    }

    if (subscriber.status === "unsubscribed") {
      return NextResponse.redirect(`${baseUrl}?status=already-unsubscribed`);
    }

    await collection.updateOne(
      { email },
      { $set: { status: "unsubscribed", unsubscribedAt: new Date() } }
    );

    // Send unsubscription confirmation email
    const resubscribeUrl = baseUrl;
    try {
      await sendEmail({
        to: email,
        subject: "You've been unsubscribed from Code Quests",
        html: unsubscriptionConfirmationEmail({
          name: subscriber.name,
          resubscribeUrl,
        }),
      });
    } catch (err) {
      console.error("[/api/unsubscribe] Failed to send unsubscription email:", err);
    }

    return NextResponse.redirect(`${baseUrl}?status=unsubscribed`);
  } catch (error) {
    console.error("[/api/unsubscribe] Database error:", error);
    return NextResponse.redirect(`${baseUrl}?status=error`);
  }
}
