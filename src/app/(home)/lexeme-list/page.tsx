import { LexemeList } from "@/modules/lexeme-list";
import { Suspense } from "react";

export default function LemexeListPage() {
  return (
    <Suspense>
      <LexemeList />
    </Suspense>
  );
}
