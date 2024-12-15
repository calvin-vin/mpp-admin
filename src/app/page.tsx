// src/app/page.tsx
"use client";

import { useQueryAuth } from "@/hooks/useQueryAuth";
import LoadingSpinner from "./(components)/LoadingSpinner";

export default function Home() {
  useQueryAuth();

  return <LoadingSpinner />;
}
