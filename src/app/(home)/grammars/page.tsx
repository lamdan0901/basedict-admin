import { Grammars } from "@/modules/grammars";
import { Suspense } from "react";

export default function LemexeListPage() {
  return (
    <Suspense>
      <Grammars />
    </Suspense>
  );
}