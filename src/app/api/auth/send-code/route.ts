import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVerificationCode } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ error: "邮箱和类型不能为空" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    if (!["REGISTER", "RESET_PASSWORD"].includes(type)) {
      return NextResponse.json({ error: "无效的验证码类型" }, { status: 400 });
    }

    // REGISTER: email must NOT be registered
    if (type === "REGISTER") {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "邮箱已被注册" }, { status: 409 });
      }
    }

    // RESET_PASSWORD: email MUST be registered
    if (type === "RESET_PASSWORD") {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        return NextResponse.json({ error: "该邮箱未注册" }, { status: 404 });
      }
    }

    const code = await createVerificationCode(email, type);
    await sendVerificationEmail(email, code, type);

    return NextResponse.json({ message: "验证码已发送" });
  } catch {
    return NextResponse.json({ error: "发送验证码失败" }, { status: 500 });
  }
}
