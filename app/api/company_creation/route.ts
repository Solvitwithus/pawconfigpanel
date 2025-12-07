import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString() || "";
    const location = formData.get("location")?.toString() || "";
    const date = formData.get("date")?.toString() || "";
    const cp = formData.get("cp")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!name || !location || !date || !cp || !password) {
      return NextResponse.json(
        { status: "ERROR", message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check for duplicate kennel name
    const existing = await prisma.kennel.findUnique({
      where: { name },
    });
    if (existing) {
      return NextResponse.json(
        { status: "ERROR", message: "Kennel name already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.kennel.create({
      data: {
        name,
        location,
        date,
        cp,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ status: "SUCCESS", message: "Kennel created" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "ERROR", message: "Failed to create kennel" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}



export async function GET() {
  try {
    const data = await prisma.kennel.findMany({
      orderBy: { name: "asc" }, // must specify a field
      where:{id:true,name:true}
    });

    return NextResponse.json(
      { status: "SUCCESS", message: "Kennels fetched", data },
      { status: 200 } // HTTP status code
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "ERROR", message: "Failed to fetch kennels" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}