import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

// -------------------
// CORS HEADERS
// -------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// -------------------
// LOGIN POST ROUTE
// -------------------
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const companyName = form.get("companyName")?.toString() || "";
    const companyPassword = form.get("companyPassword")?.toString() || "";
    const userName = form.get("userName")?.toString() || "";
    const userPassword = form.get("userPassword")?.toString() || "";

    if (!companyName || !companyPassword || !userName || !userPassword) {
      return NextResponse.json(
        { status: "ERROR", message: "Missing login fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. FIND COMPANY (KENNEL)
    const company = await prisma.kennel.findUnique({
      where: { name: companyName },
    });

    if (!company) {
      return NextResponse.json(
        { status: "ERROR", message: "Company not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // 2. CHECK COMPANY PASSWORD
    const companyPassOk = await bcrypt.compare(
      companyPassword,
      (company as any).password
    );

    if (!companyPassOk) {
      return NextResponse.json(
        { status: "ERROR", message: "Invalid company password" },
        { status: 401, headers: corsHeaders }
      );
    }

    // 3. FIND USER INSIDE THAT COMPANY
    const user = await prisma.users.findFirst({
      where: {
        name: userName,
        kennelId: company.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { status: "ERROR", message: "User not found in this company" },
        { status: 404, headers: corsHeaders }
      );
    }

    // 4. CHECK USER PASSWORD
    const userPassOk = await bcrypt.compare(
      userPassword,
      (user as any).password
    );

    if (!userPassOk) {
      return NextResponse.json(
        { status: "ERROR", message: "Invalid user password" },
        { status: 401, headers: corsHeaders }
      );
    }

    // SUCCESS
    return NextResponse.json(
      {
        status: "SUCCESS",
        message: "Login successful",
        company,
        user,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "ERROR", message: "Failed to log in" },
      { status: 500, headers: corsHeaders }
    );
  }
}
