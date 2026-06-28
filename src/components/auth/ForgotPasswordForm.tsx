"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

type Step = "email" | "reset";

export default function ForgotPasswordForm() {
  // v2 - email verification with code fallback
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [codeHint, setCodeHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const sendCode = async () => {
    if (!email || countdown > 0) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("请输入正确的邮箱地址");
      return;
    }

    setError("");
    setMessage("");
    setCodeHint("");
    setSendingCode(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);

      if (data.code) {
        setCodeHint(data.code);
      }

      if (res.ok) {
        setStep("reset");
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.error || "发送失败");
      }
    } catch {
      setError("网络错误，请稍后再试");
    } finally {
      setSendingCode(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "重置失败");
        return;
      }

      setMessage("密码重置成功！");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  if (step === "email") {
    return (
      <div className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            注册邮箱
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
            placeholder="请输入注册时使用的邮箱"
            required
            autoComplete="email"
          />
        </div>

        <button
          type="button"
          onClick={sendCode}
          disabled={sendingCode || countdown > 0}
          className="w-full bg-mint-500 hover:bg-mint-600 text-white font-medium rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {sendingCode && <Spinner className="border-white border-r-transparent" />}
          {countdown > 0 ? `${countdown}秒后可重发` : "发送验证码"}
        </button>

        <p className="text-center text-sm text-gray-500">
          <Link href="/login" className="text-mint-700 hover:text-mint-800 font-medium">
            返回登录
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {message && !codeHint && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {codeHint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm">
          <p className="text-yellow-700 mb-1">⚠️ 邮件发送失败，验证码如下：</p>
          <p className="text-2xl font-bold text-yellow-800 tracking-widest text-center">{codeHint}</p>
          <p className="text-yellow-600 text-xs mt-1">10分钟内有效，请勿泄露</p>
        </div>
      )}

      <div className="bg-mint-50 border border-mint-200 rounded-lg px-4 py-3 text-sm text-mint-700">
        验证码已生成并发送至 <strong>{email}</strong>
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1.5">
          验证码
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
          placeholder="输入6位验证码"
          required
          maxLength={6}
          inputMode="numeric"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
          新密码
        </label>
        <input
          id="newPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
          placeholder="至少6位新密码"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      <div>
        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
          确认新密码
        </label>
        <input
          id="confirmNewPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
          placeholder="再次输入新密码"
          required
          autoComplete="new-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-mint-500 hover:bg-mint-600 text-white font-medium rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {loading && <Spinner className="border-white border-r-transparent" />}
        重置密码
      </button>
    </form>
  );
}
