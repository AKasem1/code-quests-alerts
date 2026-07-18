import { NextResponse } from "next/server";
import { fetchAllCategories, fetchRegistrationQuests } from "@/app/lib/codeQuestsApi";
import { getCategoryCollection } from "@/app/lib/models/category";
import { getSubscriberCollection } from "@/app/lib/models/subscriber";
import { getSentAlertCollection } from "@/app/lib/models/sentAlert";
import { sendEmail } from "@/app/lib/mailer";
import { signToken } from "@/app/lib/token";
import { jobAlertEmail, type JobAlertItem } from "@/app/lib/emailTemplate";

const QUEST_BASE_URL = "https://app.code-quests.com/quests";

/**
 * Strip emojis and leading symbols from category names.
 */
function stripEmojis(str: string): string {
  return str
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu,
      ""
    )
    .replace(/^[\s⚛]+/, "")
    .trim();
}

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string | null
): string | null {
  if (min == null && max == null) return null;
  const cur = currency ?? "";
  if (min != null && max != null) {
    return `${min.toLocaleString()} – ${max.toLocaleString()} ${cur}`.trim();
  }
  if (min != null) return `From ${min.toLocaleString()} ${cur}`.trim();
  return `Up to ${max!.toLocaleString()} ${cur}`.trim();
}

// ---------------------------------------------------------------------------
// Job 1: Sync categories from Code Quests
// ---------------------------------------------------------------------------

async function syncCategories(): Promise<number> {
  const cqCategories = await fetchAllCategories();
  const collection = await getCategoryCollection();

  for (const cat of cqCategories) {
    await collection.updateOne(
      { cqId: cat.id },
      { $set: { name: stripEmojis(cat.name) } },
      { upsert: true }
    );
  }

  return cqCategories.length;
}

// ---------------------------------------------------------------------------
// Job 2: Send job alert emails for new registration-phase quests
// ---------------------------------------------------------------------------

async function sendJobAlerts(): Promise<{ emailsSent: number; newJobs: number }> {
  const quests = await fetchRegistrationQuests();
  if (quests.length === 0) return { emailsSent: 0, newJobs: 0 };

  const sentAlertCol = await getSentAlertCollection();
  const subscriberCol = await getSubscriberCollection();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  // Get all active subscribers
  const subscribers = await subscriberCol
    .find({ status: "subscribed" })
    .toArray();

  if (subscribers.length === 0) return { emailsSent: 0, newJobs: quests.length };

  let emailsSent = 0;

  for (const subscriber of subscribers) {
    // Filter quests matching this subscriber's categories
    const matchingQuests = quests.filter((q) =>
      subscriber.categoryIds.includes(q.categoryId)
    );

    if (matchingQuests.length === 0) continue;

    // Check which of these have already been sent to this subscriber
    const alreadySent = await sentAlertCol
      .find({
        subscriberEmail: subscriber.email,
        jobId: { $in: matchingQuests.map((q) => q.id) },
      })
      .toArray();

    const alreadySentIds = new Set(alreadySent.map((a) => a.jobId));
    const newQuests = matchingQuests.filter((q) => !alreadySentIds.has(q.id));

    if (newQuests.length === 0) continue;

    // Build job items for the email
    const jobItems: JobAlertItem[] = newQuests.map((q) => ({
      id: q.id,
      title: q.title,
      orgName: q.org.name,
      categoryName: q.category.name,
      salary: formatSalary(q.minSalary, q.maxSalary, q.currency),
      workingStatus: q.workingStatus,
      hiringType: q.hiringType,
      registrationDeadline: q.registrationDeadline,
      technologies: q.technologies ?? [],
      questUrl: `${QUEST_BASE_URL}/${q.id}`,
    }));

    // Generate unsubscribe URL
    const unsubscribeToken = signToken(subscriber.email);
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${unsubscribeToken}`;

    const html = jobAlertEmail({
      name: subscriber.name,
      jobs: jobItems,
      unsubscribeUrl,
    });

    try {
      await sendEmail({
        to: subscriber.email,
        subject:
          newQuests.length === 1
            ? `New quest matching your interests: ${stripEmojis(newQuests[0].title)}`
            : `${newQuests.length} new quests matching your interests`,
        html,
      });

      // Record sent alerts
      const sentRecords = newQuests.map((q) => ({
        jobId: q.id,
        subscriberEmail: subscriber.email,
        sentAt: new Date(),
      }));
      await sentAlertCol.insertMany(sentRecords);

      emailsSent++;
    } catch (err) {
      console.error(
        `[cron] Failed to send job alert to ${subscriber.email}:`,
        err
      );
    }
  }

  return { emailsSent, newJobs: quests.length };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Job 1: Sync categories
    const categoriesSynced = await syncCategories();
    console.log(`[cron] Synced ${categoriesSynced} categories`);

    // Job 2: Send job alerts
    const { emailsSent, newJobs } = await sendJobAlerts();
    console.log(
      `[cron] Found ${newJobs} registration quests, sent ${emailsSent} alert emails`
    );

    return NextResponse.json({
      success: true,
      categoriesSynced,
      registrationQuests: newJobs,
      emailsSent,
    });
  } catch (error) {
    console.error("[cron] Worker error:", error);
    return NextResponse.json(
      { error: "Cron job failed." },
      { status: 500 }
    );
  }
}
