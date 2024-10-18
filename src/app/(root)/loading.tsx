import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="loading-container flex items-center justify-center h-full">
    <Loader2 size={20} className="animate-spin" /> &nbsp;
    <p>Cargando</p>
  </div>
  );
}