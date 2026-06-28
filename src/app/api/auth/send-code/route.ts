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

    if (type === "REGISTER") {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "邮箱已被注册" }, { status: 409 });
      }
    }

    if (type === "RESET_PASSWORD") {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        return NextResponse.json({ error: "该邮箱未注册" }, { status: 404 });
      }
    }

    const code = await createVerificationCode(email, type);
    const sent = await sendVerificationEmail(email, code, type);

    return NextResponse.json({
      message: sent ? "验证码已发送到邮箱" : "邮件发送失败，验证码如下（10分钟有效）",
      code: sent ? undefined : code,
    });
  } catch {
    return NextResponse.json({ error: "发送验证码失败" }, { status: 500 });
  }
}
