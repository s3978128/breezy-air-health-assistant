import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   // Check if the request is for a protected API route
//   if (
//     request.nextUrl.pathname.startsWith('/api/user') ||
//     request.nextUrl.pathname.startsWith('/api/alerts')
//   ) {
//     const token = await getToken({ req: request })

//     // If the user is not authenticated, redirect to the home page
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }
//   }

//   return NextResponse.next()
// }

import authConfig from './auth.config'
import NextAuth from 'next-auth'

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
})

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/api/user/:path*', '/api/alerts/:path*', '/api/:path*'],
}
