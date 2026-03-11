import { authenticator } from "otplib";
import QRCode from "qrcode";

const APP_NAME = "BindingBuddy Admin";

export function generateSecret(): string {
  return authenticator.generateSecret();
}

export function verifyToken(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}

export function getOtpauthUri(email: string, secret: string): string {
  return authenticator.keyuri(email, APP_NAME, secret);
}

export async function generateQRDataURL(
  email: string,
  secret: string
): Promise<string> {
  const uri = getOtpauthUri(email, secret);
  return QRCode.toDataURL(uri);
}
