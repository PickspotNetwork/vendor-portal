import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function Home() {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10 gap-4">
      <Image
        src="/images/logo.png"
        alt="Pickspot wordmark image"
        width={2972}
        height={748}
        priority
        className="h-12 w-auto"
      />
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
