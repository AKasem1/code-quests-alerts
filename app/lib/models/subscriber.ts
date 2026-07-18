import type { ObjectId } from "mongodb";
import { getCollection } from "@/app/lib/db";

export interface Subscriber {
  _id?: ObjectId;
  name: string;
  email: string;
  status: "subscribed" | "unsubscribed";
  /** Code Quests category IDs the subscriber wants alerts for */
  categoryIds: number[];
  createdAt: Date;
  unsubscribedAt?: Date;
}

export async function getSubscriberCollection() {
  return getCollection<Subscriber>("subscribers");
}
