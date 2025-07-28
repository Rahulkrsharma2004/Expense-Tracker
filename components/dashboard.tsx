"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  LogOut,
  FileText,
  Calendar,
  Filter,
  Download,
  Edit,
} from "lucide-react";
import Image from "next/image";
import AddInvoiceModal from "./add-invoice-modal";
import DateRangePicker from "./date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Invoice {
  _id: string;
  date: string;
  vendorName: string;
  employeeName?: string;
  category?: string;
  gstAmount: string | number;
  totalAmount: string | number;
  imageUrl?: string;
  createdAt?: number;
  file?: File;
}

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      console.log(data);
      setInvoices(data);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const sorted = [...invoices]?.sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );
    if (dateRange) {
      const filtered = sorted.filter((inv) => {
        const d = new Date(inv.date);
        return d >= new Date(dateRange.start) && d <= new Date(dateRange.end);
      });
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(sorted);
    }
  }, [invoices, dateRange]);

  // In Dashboard component
  const handleAddInvoice = async (
    invoice: Omit<Invoice, "_id" | "createdAt">
  ) => {
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create invoice");
      }

      fetchInvoices();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding invoice", err);
    }
  };

  const handleEditInvoice = async (updated: Invoice) => {
    try {
      const res = await fetch(`/api/invoices/${updated._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        fetchInvoices();
        setEditingInvoice(null);
      }
    } catch (err) {
      console.error("Error updating invoice", err);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchInvoices();
        alert("Invoice Deleted Success.");
      }
    } catch (err) {
      console.error("Error deleting invoice", err);
    }
  };

  const handleInvoiceClick = (inv: Invoice) => {
    setEditingInvoice(inv);
  };

  const handleExportCSV = () => {
    if (!dateRange) {
      setShowExportModal(true);
      return;
    }

    const csv = [
      ["Date", "Vendor", "Employee", "Category", "GST", "Total"],
      ...filteredInvoices.map((inv) => [
        inv.date,
        inv.vendorName,
        inv.employeeName || "",
        inv.category || "",
        inv.gstAmount.toString(),
        inv.totalAmount.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices_${dateRange.start}_to_${dateRange.end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleInvoiceImageClick = (invoice: Invoice) => {
    if (invoice.imageUrl) {
      setSelectedImageUrl(invoice.imageUrl);
    }
  };

  const recentInvoice = filteredInvoices.slice(0, 1);

  return (
    <div className="min-h-screen bg-slate-900 font-montserrat">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Image
            src="/logo-white.png"
            alt="logo"
            width={120}
            height={48}
            className="h-6 sm:h-8 w-auto"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogoutModal(true)}
            className="text-slate-300 hover:text-white text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl sm:text-2xl text-white font-semibold">
            Dashboard
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDatePicker(true)}
              className="bg-slate-800 border-slate-600 text-white"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange
                ? `${dateRange.start} → ${dateRange.end}`
                : "Select Date Range"}
            </Button>

            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="bg-slate-800 border-slate-600 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>

            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-slate-600 text-white hover:bg-slate-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Recent Invoice */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentInvoice.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">
                No invoices uploaded
              </p>
            ) : (
              recentInvoice.map((inv) => (
                <div
                  key={inv._id}
                  className="p-3 sm:p-4 border border-slate-600 rounded-lg text-white hover:bg-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2"
                >
                  {/* Image + Basic Info */}
                  <div
                    onClick={() => handleInvoiceClick(inv)}
                    className="flex-1 flex gap-3 items-center cursor-pointer"
                  >
                    {inv.imageUrl && (
                      <img
                        src={inv.imageUrl}
                        alt="Invoice"
                        className="w-20 h-20 object-cover rounded border border-gray-500"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent parent click
                          handleInvoiceImageClick(inv);
                        }}
                      />
                    )}
                    <div className="space-y-1">
                      <p className="font-medium text-sm sm:text-base">
                        Vendor Name: {inv.vendorName}
                      </p>
                      <p className="font-medium text-sm sm:text-base">
                        Employee Name: {inv.employeeName}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Date: {new Date(inv.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Category: {inv.category}
                      </p>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="text-left sm:text-right space-y-1">
                    <p className="text-xs sm:text-sm text-slate-300">
                      GST: ₹{inv.gstAmount}
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      Total Bill: ₹{inv.totalAmount}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteInvoice(inv._id)}
                    className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm w-fit"
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* All Invoices */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center text-lg">
              <span className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                All Invoices
              </span>
              {dateRange && (
                <Badge className="bg-slate-700 text-white font-medium">
                  {filteredInvoices.length} results
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">
                {dateRange
                  ? "No invoices for selected range"
                  : "No invoices uploaded"}
              </p>
            ) : (
              filteredInvoices.map((inv) => (
                <div
                  key={inv._id}
                  className="p-3 sm:p-4 border border-slate-600 rounded-lg text-white hover:bg-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2"
                >
                  {/* Image Preview Section */}
                  <div
                    onClick={() => handleInvoiceClick(inv)}
                    className="flex-1 flex gap-3 cursor-pointer items-center"
                  >
                    {inv.imageUrl && (
                      <img
                        src={inv.imageUrl}
                        alt="Invoice"
                        className="w-20 h-20 object-cover rounded border border-gray-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // 👈 prevents outer click from firing
                          handleInvoiceImageClick(inv);
                        }}
                      />
                    )}
                    <div className="space-y-1">
                      <p className="font-medium text-sm sm:text-base">
                        Vendeor Name: {inv.vendorName}
                      </p>
                      <p className="font-medium text-sm sm:text-base">
                        Employee Name: {inv.employeeName}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Date: {new Date(inv.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Category: {inv.category}
                      </p>
                    </div>
                  </div>

                  {/* Bill Details */}
                  <div className="text-left sm:text-right sm:mr-4 space-y-1">
                    <p className="text-xs sm:text-sm text-slate-300">
                      GST: ₹{inv.gstAmount}
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      Total Bill: ₹{inv.totalAmount}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteInvoice(inv._id)}
                    className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm w-fit"
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      {selectedImageUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedImageUrl}
              alt="Full View"
              className="max-h-[90vh] w-full object-contain rounded shadow-lg"
            />
            <button
              onClick={() => setSelectedImageUrl(null)}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <AddInvoiceModal
        isOpen={showAddModal || !!editingInvoice}
        onClose={() => {
          setShowAddModal(false);
          setEditingInvoice(null);
        }}
        onSave={editingInvoice ? handleEditInvoice : handleAddInvoice}
        editingInvoice={editingInvoice}
      />
      <DateRangePicker
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={setDateRange}
        currentRange={dateRange}
      />
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="bg-slate-800 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Select Date Range</DialogTitle>
          </DialogHeader>
          <p>You must select a date range before exporting.</p>
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExportModal(false)}
              className="bg-slate-700 border-slate-600 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowExportModal(false);
                setShowDatePicker(true);
              }}
              className="bg-slate-600 text-white"
            >
              Select Date Range
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="bg-slate-800 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to logout?</p>
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              className="bg-slate-700 border-slate-600 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={onLogout}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
