import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.qq.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  to: string,
  code: string,
  type: "REGISTER" | "RESET_PASSWORD"
) {
  const subject =
    type === "REGISTER"
      ? "IELTS学习助手 - 邮箱验证码"
      : "IELTS学习助手 - 密码重置验证码";
  const purpose = type === "REGISTER" ? "注册账号" : "重置密码";

  const html = `
    <div style="max-width:480px;margin:0 auto;font-family:sans-serif;">
      <h2 style="color:#356859;">IELTS 学习助手</h2>
      <p>您正在${purpose}，验证码如下：</p>
      <div style="font-size:32px;font-weight:bold;letter-spacing:4px;text-align:center;padding:16px;background:#f0faf6;border-radius:8px;margin:16px 0;">
        ${code}
      </div>
      <p style="color:#888;font-size:13px;">验证码10分钟内有效，请勿泄露给他人。</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`Verification email sent to ${to} for ${type}`);
  } catch (err) {
    console.error("Failed to send email:", err);
    // Also log the code so it's available in Railway logs
    console.log(`[VERIFICATION CODE] ${to} - ${type}: ${code}`);
    throw err;
  }
}
