import {
  validatePassword,
  getPasswordStrengthColor,
  getPasswordStrengthBg,
} from "@/lib/password-validation";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrength({
  password,
  showRequirements = true,
}: PasswordStrengthProps) {
  const validation = validatePassword(password);

  if (!password) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password Strength</span>
          <span
            className={`font-medium capitalize ${getPasswordStrengthColor(validation.strength)}`}
          >
            {validation.strength}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBg(validation.strength)}`}
            style={{
              width: `${(validation.requirements.filter((r) => r.satisfied).length / validation.requirements.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {showRequirements && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Password must contain:
          </p>
          <ul className="space-y-1">
            {validation.requirements.map((req) => (
              <li key={req.id} className="flex items-center gap-2 text-sm">
                {req.satisfied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    req.satisfied ? "text-green-700" : "text-muted-foreground"
                  }
                >
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
