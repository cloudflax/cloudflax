import { signOut } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const next = url.searchParams.get("next") ?? "/login"

  await signOut({ redirect: false })

  return NextResponse.redirect(new URL(next, url))
}

