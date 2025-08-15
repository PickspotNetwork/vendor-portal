import { HeaderNav } from "@/components/auth/header-nav";
import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <HeaderNav />
        <LoginForm />
      </div>
    </div>
  );
}
