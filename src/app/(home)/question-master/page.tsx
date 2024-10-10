import { QuestionMaster } from "@/modules/question-master";
import { Suspense } from "react";

export default function QuestionMasterPage() {
  return (
    <Suspense>
      <QuestionMaster />
    </Suspense>
  );
}
