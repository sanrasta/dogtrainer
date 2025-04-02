"use client";

import { UserButton } from "@clerk/nextjs";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 bg-black">{children}</main>
    </>
  );
}
