import { Invoice } from "@/lib/models/invoices";
import { connectDb } from "@/lib/db";
import { NextResponse } from "next/server";

// CREATE INVOICE
export async function POST(req: Request) {
  try {
    await connectDb();
    const body = await req.json();
    console.log("Parsed Body:", body);

    const newInvoice = await Invoice.create(body);
    console.log(newInvoice);
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice:", error); // ✅ Catch real error here
    return NextResponse.json(
      { error: error.message || "Failed to create invoice" },
      { status: 500 }
    );
  }
}

// GET ALL INVOICES
export async function GET() {
  try {
    await connectDb();
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
