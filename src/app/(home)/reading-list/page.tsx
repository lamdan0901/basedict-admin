"use client";

import { ReadingList } from "@/modules/reading-list";
import { Suspense } from "react";

export default function ReadingListPage() {
  return (
    <Suspense>
      <ReadingList />
    </Suspense>
  );
}
