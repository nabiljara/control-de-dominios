import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDate as formatUtil } from "date-fns"
import crypto from "crypto"
import { es } from "date-fns/locale";
const SECRET_KEY = process.env.SECRET_KEY || '';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name.split(' ').map(word => word[0]).join('').toUpperCase()
}

export const formatDate = (date: string) => {
  return formatUtil(new Date(date), "dd/MM/yyyy")
};

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

export const formatTextDate = (date: string) => {
  return format(date, "d 'de' MMMM 'del' yyyy", { locale: es })
}

export function formatAuditDate(dateString: string): string {
  try {
    const date = new Date(dateString)

    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, "0")
      const minutes = String(date.getMinutes()).padStart(2, "0")

      return `${day}/${month}/${year} ${hours}:${minutes}`
    }
    return dateString
  } catch (error) {
    return dateString
  }
}