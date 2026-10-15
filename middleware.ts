import { NextRequest, NextResponse } from 'next/server';
export function middleware(req: NextRequest) {
 const { pathname } = req.nextUrl;
 if (pathname === '/') return NextResponse.redirect(new URL('/pt', req.url));
 if (!/^\/(pt|en)(\/|$)/.test(pathname)) return NextResponse.next();
 return NextResponse.next();
}
export const config = { matcher: ['/'] };
