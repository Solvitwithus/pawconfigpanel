import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// -------------------
// CORS HEADERS
// -------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// -------------------
// LOGIN POST ROUTE
// -------------------
export async function POST(req: NextRequest) {
  try {
    console.log("Hi man");
    
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

  

    const company = await prisma.kennel.findUnique({
  where: { name: companyName },
  select: {
    id: true,
    cp: true,
    password: true,    // ← THIS IS REQUIRED
  },
});

    if (!company) {
      return NextResponse.json(
        { status: "ERROR", message: "Company not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // 2. CHECK COMPANY PASSWORD  (Ensure your model has "password")
  
    
    const companyPassOk = await bcrypt.compare(companyPassword, company.password);

    if (!companyPassOk) {
      return NextResponse.json(
        { status: "ERROR", message: "Invalid company password" },
        { status: 401, headers: corsHeaders }
      );
    }

   

    const user = await prisma.users.findFirst({
  where: {
    name: userName,
    kennelId: company.id,
  },
  select: {
    id: true,
    password: true,    // ← THIS IS REQUIRED
  },
});

    if (!user) {
      return NextResponse.json(
        { status: "ERROR", message: "User not found in this company" },
        { status: 404, headers: corsHeaders }
      );
    }

    // 4. CHECK USER PASSWORD  (Ensure your model has "password")
const userPassOk = await bcrypt.compare(userPassword, user.password);

    if (!userPassOk) {
      return NextResponse.json(
        { status: "ERROR", message: "Invalid user password" },
        { status: 401, headers: corsHeaders }
      );
    }

    // -------------------
    // 5. GENERATE JWT TOKEN
    // -------------------
    const token = jwt.sign(
      {
        userId: user.id,
        cp: company.cp,
       
        
      },
      process.env.JWT_SECRET||"pass",
      { expiresIn: "7d" }
    );

    // SUCCESS
    return NextResponse.json(
      {
        status: "SUCCESS",
        message: "Login successful",
        company,
        user,
        token,
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
  console.error("Full login error:", error);
  return NextResponse.json(
    { status: "ERROR", message: "Failed to log in", error: String(error) },
    { status: 500, headers: corsHeaders }
  );
}

}
