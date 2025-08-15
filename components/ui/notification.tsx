import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect } from "react";

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Notification({
  type,
  message,
  onClose,
  duration = 5000,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg p-4 shadow-lg max-w-md",
        "animate-in slide-in-from-top-2 duration-300",
        type === "success"
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200",
      )}
    >
      {type === "success" ? (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600" />
      )}

      <p className="text-sm font-medium flex-1">{message}</p>

      <button
        onClick={onClose}
        className={cn(
          "rounded-full p-1 hover:bg-opacity-20 transition-colors",
          type === "success" ? "hover:bg-green-600" : "hover:bg-red-600",
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
