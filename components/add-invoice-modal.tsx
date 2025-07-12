"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Check, Edit } from "lucide-react";

interface Invoice {
  id?: string;
  date: string;
  vendorName: string;
  employeeName: string;
  category: string;
  gstAmount: string | number;
  totalAmount: string | number;
  imageUrl?: string;
  createdAt?: number;
}

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  editingInvoice?: Invoice | null;
}

export default function AddInvoiceModal({
  isOpen,
  onClose,
  onSave,
  editingInvoice,
}: AddInvoiceModalProps) {
  const [step, setStep] = useState<"upload" | "extract" | "confirm">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [customCategoryError, setCustomCategoryError] = useState("");

  const categoryOptions = [
    "Mobile bill",
    "DTH",
    "Tools",
    "Food",
    "Events",
    "Others",
  ];
  const [extractedData, setExtractedData] = useState<Invoice>({
    date: "",
    vendorName: "",
    employeeName: "",
    category: "",
    gstAmount: "",
    totalAmount: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingInvoice) {
      setExtractedData(editingInvoice);
      setStep("confirm");
      setIsEditing(true);
      setSelectedImage(editingInvoice.imageUrl || null);

      if (editingInvoice.category?.startsWith("Others:")) {
        setCustomCategory(editingInvoice.category.replace("Others: ", ""));
      }
    } else {
      setStep("upload");
      setIsEditing(false);
      setSelectedImage(null);
      setCustomCategory("");
      setExtractedData({
        date: "",
        vendorName: "",
        employeeName: "",
        category: "",
        gstAmount: "",
        totalAmount: "",
      });
    }
  }, [editingInvoice, isOpen]);

  const extractInvoiceData = (text: string) => {
    const lines = text.split("\n");
    let invoiceData: Partial<Invoice> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();

      // Date (supports multiple labels and formats)
      if (line.includes("date")) {
        const dateMatch = line.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/);
        if (dateMatch) {
          const rawDate = dateMatch[0];
          invoiceData.date = rawDate.includes("/")
            ? new Date(rawDate).toISOString().split("T")[0]
            : rawDate;
        }
      }

      // Vendor / Supplier / Seller / Billed By
      if (
        line.includes("vendor name") ||
        line.includes("vendor") ||
        line.includes("billed by") ||
        line.includes("billed from") ||
        line.includes("supplier") ||
        line.includes("seller") ||
        line.includes("provided by")
      ) {
        const name = lines[i].split(":")[1]?.trim();
        if (name) invoiceData.vendorName = name;
      }

      // Employee / Billed To / Buyer
      if (
        line.includes("employee name") ||
        line.includes("employee") ||
        line.includes("billed to") ||
        line.includes("received by") ||
        line.includes("for employee") ||
        line.includes("customer") ||
        line.includes("buyer")
      ) {
        const name = lines[i].split(":")[1]?.trim();
        if (name) invoiceData.employeeName = name;
      }

      // Category / Type
      if (
        line.includes("category") ||
        line.includes("type of expense") ||
        line.includes("expense category")
      ) {
        const category = lines[i].split(":")[1]?.trim();
        if (category) invoiceData.category = category;
      }

      // GST Amount / Tax
      if (
        line.includes("gst") ||
        line.includes("tax amount") ||
        line.includes("cgst") ||
        line.includes("sgst")
      ) {
        const gstMatch = lines[i].match(/(\d+(\.\d{1,2})?)/);
        if (gstMatch) invoiceData.gstAmount = gstMatch[1];
      }

      // Total Amount / Grand Total / Amount Payable
      if (
        line.startsWith("total amount") ||
        line.includes("grand total") ||
        line.includes("amount payable") ||
        line.includes("total payable") ||
        line.includes("total (inr)")
      ) {
        const totalMatch = lines[i].match(/(\d+(\.\d{1,2})?)/);
        if (totalMatch) invoiceData.totalAmount = totalMatch[1];
      }
    }

    return invoiceData;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setStep("extract");

    try {
      const result = await Tesseract.recognize(file, "eng");
      const text = result.data.text;
      console.log("OCR Text Result:", text);

      const extractedData = extractInvoiceData(text);

      setExtractedData({
        date: extractedData.date || new Date().toISOString().split("T")[0],
        vendorName: extractedData.vendorName || "",
        employeeName: extractedData.employeeName || "",
        category: extractedData.category || "",
        gstAmount: extractedData.gstAmount || "0",
        totalAmount: extractedData.totalAmount || "0",
        imageUrl,
      });

      setStep("confirm");
    } catch (error) {
      console.error("OCR error:", error);
      alert("Failed to extract data from image");
      setStep("upload");
    }
  };

  const handleInputChange = (field: keyof Invoice, value: string | number) => {
    setExtractedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomCategoryChange = (value: string) => {
    setCustomCategory(value);
    setCustomCategoryError("");

    if (value.length >= 20) {
      handleInputChange("category", `Others: ${value}`);
    } else {
      handleInputChange("category", "Others");
    }
  };

  const handleSave = () => {
    if (extractedData.category === "Others" && customCategory.length < 20) {
      setCustomCategoryError(
        "Custom category must be at least 20 characters long"
      );
      return;
    }
    onSave(extractedData);
    handleClose();
  };

  const handleClose = () => {
    setStep("upload");
    setSelectedImage(null);
    setExtractedData({
      date: "",
      vendorName: "",
      employeeName: "",
      category: "",
      gstAmount: "",
      totalAmount: "",
    });
    setCustomCategory("");
    setCustomCategoryError("");
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="w-[95vw] sm:w-full max-w-md bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto 
             mx-auto sm:mx-4 sm:left-1/2 sm:translate-x-[-50%] sm:top-[10%] sm:translate-y-0"
      >
        <DialogHeader>
          <DialogTitle className="text-slate-100">
            {editingInvoice ? "Edit Invoice" : "Add New Invoice"}
          </DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <p className="text-slate-300">Choose how to add your invoice:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-slate-700 text-slate-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-5 w-5" />
                <span>Upload File</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-slate-700 text-slate-100"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="h-5 w-5" />
                <span>Take Photo</span>
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {step === "extract" && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mx-auto"></div>
            <p className="text-slate-300">Extracting invoice data...</p>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected invoice"
                className="max-w-full h-32 object-contain mx-auto rounded"
              />
            )}
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-100 text-sm sm:text-base">
                {editingInvoice ? "Invoice Details" : "Extracted Data"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-slate-300 hover:text-slate-100 hover:bg-slate-700 text-xs sm:text-sm"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {isEditing ? "Done" : "Edit"}
              </Button>
            </div>

            {selectedImage && (
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Invoice"
                className="max-w-full h-20 sm:h-24 object-contain mx-auto rounded"
              />
            )}

            <div className="space-y-3">
              <div>
                <Label htmlFor="date" className="text-slate-200 text-sm">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={extractedData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  disabled={!isEditing}
                  className="bg-slate-700 border-slate-600 text-slate-100 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="vendor" className="text-slate-200 text-sm">
                  Vendor Name
                </Label>
                <Input
                  id="vendor"
                  value={extractedData.vendorName}
                  onChange={(e) =>
                    handleInputChange("vendorName", e.target.value)
                  }
                  placeholder="Vendor Name"
                  disabled={!isEditing}
                  className="bg-slate-700 border-slate-600 text-slate-100 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="employee" className="text-slate-200 text-sm">
                  Employee Name
                </Label>
                <Input
                  id="employee"
                  value={extractedData.employeeName}
                  onChange={(e) =>
                    handleInputChange("employeeName", e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="Enter employee name"
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-slate-200 text-sm">
                  Category
                </Label>
                <select
                  id="category"
                  value={
                    extractedData.category?.startsWith("Others:")
                      ? "Others"
                      : extractedData.category
                  }
                  onChange={(e) => {
                    if (e.target.value === "Others") {
                      handleInputChange("category", "Others");
                      setCustomCategory("");
                      setCustomCategoryError("");
                    } else {
                      handleInputChange("category", e.target.value);
                      setCustomCategory("");
                      setCustomCategoryError("");
                    }
                  }}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 text-sm"
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {(extractedData.category === "Others" ||
                extractedData.category?.startsWith("Others:")) && (
                <div>
                  <Label
                    htmlFor="custom-category"
                    className="text-slate-200 text-sm"
                  >
                    Custom Category (minimum 20 characters)
                  </Label>
                  <Input
                    id="custom-category"
                    value={customCategory}
                    onChange={(e) => handleCustomCategoryChange(e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter custom category (min 20 chars)"
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 text-sm"
                    minLength={20}
                  />
                  {customCategoryError && (
                    <p className="text-red-400 text-xs mt-1">
                      {customCategoryError}
                    </p>
                  )}
                  <p className="text-slate-400 text-xs mt-1">
                    {customCategory.length}/20 characters minimum
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="gst" className="text-slate-200 text-sm">
                  GST Amount
                </Label>
                <Input
                  id="gst"
                  type="text"
                  value={extractedData.gstAmount.toString()}
                  onChange={(e) =>
                    handleInputChange("gstAmount", e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="Enter GST amount"
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="total" className="text-slate-200 text-sm">
                  Total Amount
                </Label>
                <Input
                  id="total"
                  type="text"
                  value={extractedData.totalAmount.toString()}
                  onChange={(e) =>
                    handleInputChange("totalAmount", e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="Enter total amount"
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-slate-600 hover:bg-slate-500 text-white order-1 sm:order-2"
                disabled={
                  extractedData.category === "Others" &&
                  customCategory.length < 20
                }
              >
                <Check className="h-4 w-4 mr-2" />
                {editingInvoice ? "Update Invoice" : "Save Invoice"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
