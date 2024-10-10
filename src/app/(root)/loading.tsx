import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="loading-container">
      <Loader2 size={20} className="animate-spin" /> &nbsp;
      <p>Cargando</p>
    </div>
  );
}