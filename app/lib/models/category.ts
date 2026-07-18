import type { ObjectId } from "mongodb";
import { getCollection } from "@/app/lib/db";

export interface Category {
  _id?: ObjectId;
  /** ID from the Code Quests platform */
  cqId: number;
  name: string;
}

export async function getCategoryCollection() {
  return getCollection<Category>("categories");
}
