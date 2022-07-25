import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { route } from '@helper/routes';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (request.cookies.get('token') === undefined) {
    if (!['/login', '/register'].includes(url.pathname)) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (['/login', '/register'].includes(url.pathname)) {
    let redirectUrl;
    // Check if user wants to upgrade the plan
    if (url.search !== '' && url.search.indexOf('product') > -1) {
      redirectUrl = new URL(
        `${route.accountBilling()}${url.search}`,
        request.url
      );
    } else {
      redirectUrl = new URL('/', request.url);
    }
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/account/:path*', '/project/:path*'],
};
