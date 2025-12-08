import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const address = form.get("address") as string;
    const contact = form.get("contact") as string;
    const kennelId = form.get("kennelId") as string;
    const password = form.get("password") as string;

    if (!name || !password || !kennelId) {
      return NextResponse.json(
        { status: "ERROR", message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const exist = await prisma.users.findUnique({ where: { name } });
    if (exist) {
      return NextResponse.json(
        { status: "ERROR", message: "User name already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        address,
        contact,
        kennelId,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { status: "SUCCESS", message: "User created", data: newUser },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "ERROR", message: "Failed to create user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}



export async function GET(){
  const data = await prisma.users.findMany({include:{kennel:true}})
}