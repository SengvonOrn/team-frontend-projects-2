import { NextRequest, NextResponse } from "next/server";
import { Backend_URL } from "@/constants/ConstantsUrl";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Verify token format
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return NextResponse.json(
        { error: "Invalid authorization token" },
        { status: 401 }
      );
    }

    // Call your backend API with verified token
    const response = await fetch(`${Backend_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      
      console.error("Backend profile error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch profile from backend", details: errorText },
        { status: response.status }
      );
    }

    // Parse the backend response
    const raw = await response.json();
    console.log("DEBUG: Raw backend user profile response", raw);

    // ===============================
    let data = raw;
    if (raw && typeof raw === "object" && raw.user) {
      data = raw.user;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
