'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 left-4 rounded-full shadow-lg bg-white hover:bg-gray-100 border-gray-200 transition-colors duration-200"
      onClick={() => router.back()}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="h-4 w-4 text-gray-600 group-hover:text-blue-400 transition-colors duration-200" />
    </Button>
  )
}