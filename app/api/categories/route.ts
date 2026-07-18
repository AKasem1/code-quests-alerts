import { NextResponse } from "next/server";
import { getCategoryCollection } from "@/app/lib/models/category";

export async function GET() {
  try {
    const collection = await getCategoryCollection();
    const categories = await collection.find({}).sort({ cqId: 1 }).toArray();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[/api/categories] Database error:", error);
    return NextResponse.json(
      { error: "Unable to fetch categories." },
      { status: 500 }
    );
  }
}
