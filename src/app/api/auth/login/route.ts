import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJWT, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "用户名/邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    // Detect if input is an email
    const isEmail = username.includes("@");

    const user = await prisma.user.findUnique({
      where: isEmail ? { email: username } : { username },
      select: {
        id: true,
        username: true,
        email: true,
        emailVerified: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户名/邮箱或密码不正确" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "用户名/邮箱或密码不正确" },
        { status: 401 }
      );
    }

    const token = await signJWT({ sub: user.id, username: user.username });
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch {
    return NextResponse.json({ error: "登录失败，请稍后再试" }, { status: 500 });
  }
}
