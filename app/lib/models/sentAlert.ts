import type { ObjectId } from "mongodb";
import { getCollection } from "@/app/lib/db";

export interface SentAlert {
  _id?: ObjectId;
  /** Quest ID from the Code Quests platform */
  jobId: number;
  subscriberEmail: string;
  sentAt: Date;
}

export async function getSentAlertCollection() {
  return getCollection<SentAlert>("sentAlerts");
}
