import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ContactPageClient from "./ContactPageClient";
import { Suspense } from "react";

export default async function ContactPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    }>
      <ContactPageClient />
    </Suspense>
  );
} 