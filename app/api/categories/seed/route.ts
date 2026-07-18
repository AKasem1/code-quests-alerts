import { NextResponse } from "next/server";
import { getCategoryCollection } from "@/app/lib/models/category";

const SEED_CATEGORIES = [
  { cqId: 1, name: "UI/UX" },
  { cqId: 2, name: "Backend" },
  { cqId: 3, name: "DevOps" },
  { cqId: 4, name: "Frontend" },
  { cqId: 5, name: "Game Story" },
  { cqId: 6, name: "Game Design" },
  { cqId: 7, name: "Game Art" },
  { cqId: 8, name: "Game Dev" },
  { cqId: 10, name: "QA" },
  { cqId: 11, name: "Data Science" },
];

export async function POST() {
  try {
    const collection = await getCategoryCollection();

    // Upsert each category so this endpoint is idempotent
    for (const cat of SEED_CATEGORIES) {
      await collection.updateOne(
        { cqId: cat.cqId },
        { $set: { name: cat.name } },
        { upsert: true }
      );
    }

    const categories = await collection.find({}).sort({ cqId: 1 }).toArray();
    return NextResponse.json(
      { message: `Seeded ${categories.length} categories.`, categories },
      { status: 201 }
    );
  } catch (error) {
    console.error("[/api/categories/seed] Database error:", error);
    return NextResponse.json(
      { error: "Unable to seed categories." },
      { status: 500 }
    );
  }
}
