"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  const LoginFormContent = () => (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-balance">
          Login to your Pickspot Vendor account
        </p>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="tel"
          type="tel"
          placeholder="+254 701 234 567"
          required
        />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <a
            href="#"
            className="ml-auto text-sm underline-offset-2 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input id="password" type="password" required />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          Don&apos;t have an account?{" "}
        </span>
      </div>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={() => setActiveTab("signup")}
      >
        Sign up
      </Button>
    </>
  )

  const SignupFormContent = () => (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-muted-foreground text-balance">
          Join Pickspot Vendor platform
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-firstname">First Name</Label>
        <Input
          id="signup-firstname"
          type="text"
          placeholder="John"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-lastname">Last Name</Label>
        <Input
          id="signup-lastname"
          type="text"
          placeholder="Doe"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-phone">Phone Number</Label>
        <Input
          id="signup-phone"
          type="tel"
          placeholder="+254 701 234 567"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input id="signup-password" type="password" required />
        </div>
      <Button type="submit" className="w-full">
        Create Account
      </Button>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          Already have an account?{" "}
        </span>
      </div>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={() => setActiveTab("login")}
      >
        Login
      </Button>
    </>
  )

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Tab Navigation */}
          <div className="p-6 md:p-8">
            <div className="flex mb-6 p-1 bg-muted rounded-lg">
              <button
                type="button"
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                  activeTab === "login"
                    ? "bg-black text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                  activeTab === "signup"
                    ? "bg-black text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>
            </div>
            
            <form className="flex flex-col gap-6">
              {activeTab === "login" ? <LoginFormContent /> : <SignupFormContent />}
            </form>
          </div>
          
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/images/app.png"
              alt="pickspot app"
              width={4620}
              height={7004}
              priority
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
