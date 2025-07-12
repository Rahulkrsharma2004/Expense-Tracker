"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface LoginScreenProps {
  onPhoneSubmit: (phone: string) => void;
}

export default function LoginScreen({ onPhoneSubmit }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber !== "9844533035") {
      setError("Not a valid number");
      return;
    }
    setError("");
    onPhoneSubmit(phoneNumber);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-montserrat">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Image src="/logo-white.png" alt="Skynetic Ventures" width={200} height={80} className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-100">Expense Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="tel"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="text-center text-lg bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 py-3"
                maxLength={10}
              />
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-slate-600 hover:bg-slate-500 text-white font-medium py-3"
              disabled={phoneNumber.length < 10}
            >
              Send OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
