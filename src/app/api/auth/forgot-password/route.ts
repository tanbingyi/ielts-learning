import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVerificationCode } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "邮箱不能为空" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return same message to prevent email enumeration
      return NextResponse.json({ message: "如果该邮箱已注册，验证码已发送" });
    }

    const code = await createVerificationCode(email, "RESET_PASSWORD");
    await sendVerificationEmail(email, code, "RESET_PASSWORD");

    return NextResponse.json({ message: "如果该邮箱已注册，验证码已发送" });
  } catch {
    return NextResponse.json({ error: "发送失败，请稍后再试" }, { status: 500 });
  }
}
