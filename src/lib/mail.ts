import nodemailer from "nodemailer";
import dns from "dns";

// SMTP email sending is optional.
// On Railway, outbound SMTP is blocked, so verification codes are displayed
// directly in the API response. Enable SMTP by setting SMTP_USER/SMTP_PASS env vars.

export async function sendVerificationEmail(
  to: string,
  code: string,
  type: "REGISTER" | "RESET_PASSWORD"
): Promise<boolean> {
  // SMTP not configured — code will be returned to client
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[CODE] ${to} - ${type}: ${code}`);
    return false;
  }

  // Try SMTP if configured
  try {
    const nodemailer = await import("nodemailer");
    const dns = await import("dns");

    const hostname = process.env.SMTP_HOST || "smtp.qq.com";
    const port = Number(process.env.SMTP_PORT) || 465;

    let host = hostname;
    try {
      const addrs = await dns.promises.resolve4(hostname);
      if (addrs.length > 0) host = addrs[0];
    } catch { /* fallback */ }

    const transporter = nodemailer.default.createTransport({
      host,
      port,
      secure: true,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject =
      type === "REGISTER"
        ? "IELTS学习助手 - 邮箱验证码"
        : "IELTS学习助手 - 密码重置验证码";
    const purpose = type === "REGISTER" ? "注册账号" : "重置密码";

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: `<div style="max-width:480px;margin:0 auto;font-family:sans-serif;">
        <h2 style="color:#356859;">IELTS 学习助手</h2>
        <p>您正在${purpose}，验证码如下：</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:4px;text-align:center;padding:16px;background:#f0faf6;border-radius:8px;margin:16px 0;">${code}</div>
        <p style="color:#888;font-size:13px;">验证码10分钟内有效，请勿泄露给他人。</p>
      </div>`,
    });
    console.log(`Email sent to ${to}`);
    return true;
  } catch (err) {
    console.error("SMTP failed:", (err as Error).message);
    console.log(`[CODE] ${to} - ${type}: ${code}`);
    return false;
  }
}
