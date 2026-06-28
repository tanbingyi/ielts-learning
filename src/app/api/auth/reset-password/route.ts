import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyCode } from "@/lib/verification";

export async function POST(request: Request) {
  try {
    const { email, code, password } = await request.json();

    if (!email || !code || !password) {
      return NextResponse.json({ error: "所有字段不能为空" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码长度不能少于6位" }, { status: 400 });
    }

    const valid = await verifyCode(email, code, "RESET_PASSWORD");
    if (!valid) {
      return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return NextResponse.json({ message: "密码重置成功" });
  } catch {
    return NextResponse.json({ error: "重置密码失败" }, { status: 500 });
  }
}
