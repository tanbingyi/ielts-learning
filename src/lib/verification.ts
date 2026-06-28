import { prisma } from "./prisma";

export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getCodeExpiry(): Date {
  const minutes = Number(process.env.CODE_EXPIRE_MINUTES) || 10;
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function createVerificationCode(
  email: string,
  type: "REGISTER" | "RESET_PASSWORD"
): Promise<string> {
  // Invalidate previous unused codes
  await prisma.verificationCode.updateMany({
    where: { email, type, used: false },
    data: { used: true },
  });

  const code = generateCode();
  await prisma.verificationCode.create({
    data: {
      email,
      code,
      type,
      expiresAt: getCodeExpiry(),
    },
  });
  return code;
}

export async function verifyCode(
  email: string,
  code: string,
  type: "REGISTER" | "RESET_PASSWORD"
): Promise<boolean> {
  const record = await prisma.verificationCode.findFirst({
    where: {
      email,
      code,
      type,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return false;

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { used: true },
  });

  return true;
}
