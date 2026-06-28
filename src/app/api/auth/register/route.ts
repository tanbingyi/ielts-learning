import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJWT, setAuthCookie } from "@/lib/auth";
import { verifyCode } from "@/lib/verification";

export async function POST(request: Request) {
  try {
    const { username, password, email, code } = await request.json();

    if (!username || !password || !email || !code) {
      return NextResponse.json({ error: "所有字段不能为空" }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    // Verify code
    const codeValid = await verifyCode(email, code, "REGISTER");
    if (!codeValid) {
      return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 });
    }

    const usernameRegex = /^[a-zA-Z0-9_一-鿿]{2,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "用户名格式不正确（2-20位，支持中英文、数字和下划线）" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码长度不能少于6位" }, { status: 400 });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json({ error: "用户名已被注册" }, { status: 409 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "邮箱已被注册" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, emailVerified: true, passwordHash },
      select: { id: true, username: true, email: true, emailVerified: true },
    });

    const token = await signJWT({ sub: user.id, username: user.username });
    await setAuthCookie(token);

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "注册失败，请稍后再试" }, { status: 500 });
  }
}
