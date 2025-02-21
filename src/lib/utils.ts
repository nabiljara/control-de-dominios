import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate as formatUtil } from "date-fns"
import crypto from "crypto"
const SECRET_KEY = process.env.SECRET_KEY || '';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name.split(' ').map(word => word[0]).join('').toUpperCase()
}

export const formatDate = (date: string) => {
  return formatUtil(new Date(date), "dd/MM/yyyy HH:mm")
};

export const encrypt = (text: string): { encrypted: string; iv: string } => {
  try {
    console.log('SECRET_KEY', SECRET_KEY);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, iv: iv.toString('hex') };
  } catch (error) {
    throw new Error(`Error al cifrar: ${error}`);
  }
};