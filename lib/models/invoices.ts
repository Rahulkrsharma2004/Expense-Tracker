// lib/models/invoices.ts
import mongoose, { Schema, Document } from "mongoose";

export interface InvoiceDocument extends Document {
  date: string;
  vendorName: string;
  employeeName: string;
  category: string;
  gstAmount: string | number;
  totalAmount: string | number;
  imageUrl?: string;
}

const InvoiceSchema = new Schema<InvoiceDocument>(
  {
    date: { type: String },
    vendorName: { type: String },
    employeeName: { type: String },
    category: { type: String },
    gstAmount: { type: String },
    totalAmount: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

// 👇 this is key: use mongoose.models to prevent model overwrite
export const Invoice =
  mongoose.models.Invoice || mongoose.model<InvoiceDocument>("Invoice", InvoiceSchema);
