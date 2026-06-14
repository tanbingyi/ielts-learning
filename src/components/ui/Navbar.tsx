"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-mint-500 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl no-underline">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              IELTS 学习助手
            </Link>

            {user && (
              <div className="hidden sm:flex items-center gap-1">
                <NavLink href="/reading">阅读 Reading</NavLink>
                <NavLink href="/vocabulary">单词本 Vocabulary</NavLink>
                <NavLink href="/listening" disabled>听力 Listening</NavLink>
                <NavLink href="/writing" disabled>写作 Writing</NavLink>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-20 h-8 bg-white/20 rounded animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-white text-sm font-medium hidden sm:inline">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white text-sm border border-white/40 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                >
                  退出
                </button>

                {/* Mobile nav links */}
                <div className="sm:hidden flex gap-1 ml-2">
                  <MobileNavLink href="/reading" label="阅" />
                  <MobileNavLink href="/vocabulary" label="词" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-white hover:bg-white/10 rounded-lg px-3 py-1.5 text-sm transition-colors no-underline"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-mint-700 hover:bg-mint-50 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors no-underline"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="text-white/40 text-sm font-medium px-3 py-2 cursor-not-allowed">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="text-white/90 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 text-sm font-medium transition-colors no-underline"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-white/90 hover:text-white hover:bg-white/10 rounded w-8 h-8 flex items-center justify-center text-xs font-bold transition-colors no-underline"
    >
      {label}
    </Link>
  );
}
