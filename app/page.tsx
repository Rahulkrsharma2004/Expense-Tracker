"use client";

import { useEffect, useState } from "react";
import LoginScreen from "@/components/login-screen";
import OTPScreen from "@/components/otp-screen";
import Dashboard from "@/components/dashboard";

type ScreenType = "login" | "otp" | "dashboard";

interface UserSession {
  phoneNumber: string;
  loginTime: string;
  isAuthenticated: boolean;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("login");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [expectedOtp, setExpectedOtp] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    try {
      const session = localStorage.getItem("userSession");
      if (session) {
        const parsedSession: UserSession = JSON.parse(session);
        if (parsedSession.isAuthenticated) {
          setIsAuthenticated(true);
          setPhoneNumber(parsedSession.phoneNumber);
          setCurrentScreen("dashboard");
        }
      }
    } catch (error) {
      console.error("Error parsing user session:", error);
      localStorage.removeItem("userSession");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setExpectedOtp("1234");
    setCurrentScreen("otp");
  };

  const handleOTPVerify = (enteredOtp: string) => {
    // ✅ Compare entered OTP with generated one
    if (enteredOtp === expectedOtp) {
      const session: UserSession = {
        phoneNumber,
        loginTime: new Date().toISOString(),
        isAuthenticated: true,
      };

      try {
        localStorage.setItem("userSession", JSON.stringify(session));
        setIsAuthenticated(true);
        setCurrentScreen("dashboard");
      } catch (error) {
        console.error("Error saving user session:", error);
        alert("Error saving session. Please try again.");
      }
    } else {
      alert("❌ Invalid OTP. Please check and try again.");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("userSession");
      setIsAuthenticated(false);
      setCurrentScreen("login");
      setPhoneNumber("");
      setExpectedOtp("");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
      </div>
    );
  }

  switch (currentScreen) {
    case "login":
      return <LoginScreen onPhoneSubmit={handlePhoneSubmit} />;
    case "otp":
      return (
        <OTPScreen
          phoneNumber={phoneNumber}
          expectedOtp={expectedOtp}
          onOTPVerify={handleOTPVerify}
        />
      );
    case "dashboard":
      return <Dashboard onLogout={handleLogout} />;
    default:
      return <LoginScreen onPhoneSubmit={handlePhoneSubmit} />;
  }
}
