import { clerkMiddleware } from "@clerk/nextjs/server";

// Это ядро Clerk, оно автоматически управляет доступом
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
