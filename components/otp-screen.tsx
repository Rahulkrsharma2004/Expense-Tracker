"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface OTPScreenProps {
  phoneNumber: string;
  expectedOtp: string;
  onOTPVerify: (enteredOtp:string) => void;
}

export default function OTPScreen({ phoneNumber, expectedOtp, onOTPVerify }: OTPScreenProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("")

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      setError("Please enter complete OTP");
      return;
    }

    if (otpString !== expectedOtp) {
      setError("Invalid OTP");
      return;
    }

    setError("");
    onOTPVerify(otpString);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-montserrat">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Image src="/logo-white.png" alt="Skynetic Ventures" width={200} height={80} className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-100 mb-3">Verify OTP</CardTitle>
          <p className="text-slate-300 text-sm sm:text-base">Enter the 4-digit code sent to {phoneNumber}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-medium bg-slate-700 border-slate-600 text-slate-100 focus:border-slate-400 focus:ring-slate-400"
                />
              ))}
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-slate-600 hover:bg-slate-500 text-white font-medium py-3"
              disabled={otp.join("").length !== 4}
            >
              Verify OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
