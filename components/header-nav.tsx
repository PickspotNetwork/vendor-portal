import Image from "next/image"
import Link from "next/link"

export function HeaderNav() {
  return (
    <header className="absolute top-0 left-0 right-0 md:left-8 md:right-auto z-50 flex justify-center pt-6">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="Pickspot wordmark image"
          width={2972}
          height={748}
          priority
          className="h-10 w-auto hover:opacity-80 transition-opacity"
        />
      </Link>
    </header>
  )
}
