import { Invoice } from "@/lib/models/invoices";
import { connectDb } from "@/lib/db";
import { NextResponse } from "next/server";

// UPDATE INVOICE
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // await connectDb();
    console.log(params)
    const body = await req.json();
    const updated = await Invoice.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

// DELETE INVOICE
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    // await connectDb();
    await Invoice.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Invoice deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
