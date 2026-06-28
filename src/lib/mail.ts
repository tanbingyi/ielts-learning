import nodemailer from "nodemailer";
import dns from "dns";

let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) return transporter;

  const hostname = process.env.SMTP_HOST || "smtp.qq.com";
  const port = Number(process.env.SMTP_PORT) || 465;

  // Resolve IPv4 address to avoid IPv6 connectivity issues on Railway
  let host = hostname;
  try {
    const addrs = await dns.promises.resolve4(hostname);
    if (addrs.length > 0) {
      host = addrs[0];
      console.log(`Resolved ${hostname} → ${host}`);
    }
  } catch {
    // fallback to hostname
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

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
    const transport = await getTransporter();
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`Verification email sent to ${to} for ${type}`);
  } catch (err) {
    console.error("Failed to send email:", err);
    console.log(`[VERIFICATION CODE] ${to} - ${type}: ${code}`);
    throw err;
  }
}
