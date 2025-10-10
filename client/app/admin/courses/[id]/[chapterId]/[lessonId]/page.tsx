"use client";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import LessonFormPage from "./LessonFormPage";

const LessonPage = () => {
  const params = useParams();
  const courseId = params.id as string;
  const chapterId = params.chapterId as string;
  const lessonId = params.lessonId as string;

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "flex items-center gap-2"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Go Back</span>
      </Link>

      <LessonFormPage
        courseId={courseId}
        chapterId={chapterId}
        lessonId={lessonId}
      />
    </div>
  );
};

export default LessonPage;
