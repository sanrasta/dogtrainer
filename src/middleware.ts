import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher(['/', "/sign-in(.*)"]);

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/contact(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  const path = new URL(req.url).pathname;

  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Apply middleware to all routes except Next.js internals and static files
    '/((?!_next|.*\\..*|favicon.ico).*)',
  ],
};