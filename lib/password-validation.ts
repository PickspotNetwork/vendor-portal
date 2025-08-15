export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 6 characters long",
    test: (password) => password.length >= 6,
  },
  {
    id: "uppercase",
    label: "Contains at least one uppercase letter (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "Contains at least one lowercase letter (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Contains at least one number (0-9)",
    test: (password) => /\d/.test(password),
  },
];

export interface PasswordValidationResult {
  isValid: boolean;
  requirements: Array<{
    id: string;
    label: string;
    satisfied: boolean;
  }>;
  strength: "weak" | "fair" | "good" | "strong";
}

export function validatePassword(password: string): PasswordValidationResult {
  const requirements = passwordRequirements.map((req) => ({
    id: req.id,
    label: req.label,
    satisfied: req.test(password),
  }));

  const satisfiedCount = requirements.filter((req) => req.satisfied).length;
  const isValid = satisfiedCount === requirements.length;

  let strength: "weak" | "fair" | "good" | "strong" = "weak";
  if (satisfiedCount >= 5) strength = "strong";
  else if (satisfiedCount >= 4) strength = "good";
  else if (satisfiedCount >= 2) strength = "fair";

  return {
    isValid,
    requirements,
    strength,
  };
}

export function getPasswordStrengthColor(strength: string): string {
  switch (strength) {
    case "strong":
      return "text-green-600";
    case "good":
      return "text-blue-600";
    case "fair":
      return "text-yellow-600";
    default:
      return "text-red-600";
  }
}

export function getPasswordStrengthBg(strength: string): string {
  switch (strength) {
    case "strong":
      return "bg-green-500";
    case "good":
      return "bg-blue-500";
    case "fair":
      return "bg-yellow-500";
    default:
      return "bg-red-500";
  }
}
