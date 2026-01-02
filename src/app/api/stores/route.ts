import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Mock database (replace with your actual database or Prisma)
let storesDB: any[] = [];

// GET - Fetch all stores for the currently logged-in user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // ❌ Unauthorized if session not found
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = String(session.user.id);

    // ✅ Only fetch stores for the logged-in user
    const userStores = storesDB.filter(
      (store) => String(store.userId) === userId
    );

    console.log(
      `GET /api/stores - Found ${userStores.length} stores for user ${userId}`
    );

    return NextResponse.json(
      {
        message: "Stores retrieved successfully",
        stores: userStores,
        count: userStores.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/stores error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Create a new store for the currently logged-in user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, address, city, state } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: "Store name is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if the user already has a store (optional, if you want one store per user)
    const existingStore = storesDB.find((store) => store.userId === userId);
    if (existingStore) {
      return NextResponse.json(
        { message: "You already have a store" },
        { status: 400 }
      );
    }

    // Create new store
    const newStore = {
      id: crypto.randomUUID(),
      userId,
      name: name.trim(),
      description: description?.trim() || null,
      address: address?.trim() || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storesDB.push(newStore);

    console.log(
      `POST /api/stores - Store created for user ${userId}: ${newStore.id}`
    );

    return NextResponse.json(
      { message: "Store created successfully", store: newStore },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/stores error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
