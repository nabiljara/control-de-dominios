import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';
import { formatDate as formatUtil } from "date-fns"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name.split(' ').map(word => word[0]).join('').toUpperCase()
}

const SECRET_KEY = process.env.SECRET_KEY || '';

export const encrypt = (text: string): { encrypted: string; iv: string } => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, iv: iv.toString('hex') };
  } catch (error) {
    throw new Error(`Error al cifrar: ${error}`);
  }
};

export const decrypt = (encrypted: string, iv: string): string => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error(`Error al descifrar: ${error}`);
  }
};

export function decryptPassword(password: string) {
  if (!password.includes(":")) {
    return null
  }
  const [retrievedEncrypted, retrievedIv] = password.split(":");
  return decrypt(retrievedEncrypted, retrievedIv);
}

export const formatDate = (date: string | undefined) => {
  if (date) {
    return formatUtil(new Date(date), "dd/MM/yyyy HH:mm")
  }
  return null;
};