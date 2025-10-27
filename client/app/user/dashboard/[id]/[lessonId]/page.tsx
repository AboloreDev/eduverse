"use client";

import { RenderSubDescription } from "@/components/code/Text Editor/RenderSubDescription";
import { Button } from "@/components/ui/button";
import {
  useFetchUserEnrolledLessonContentQuery,
  useUpdatelessonProgressMutation,
} from "@/state/api/lessonsApi";
import { CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import VideoPlayer from "./VideoPlayer";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-cofetti";
import LessonContentPageSkeleton from "@/components/code/Skeletons/LessonContentSkeleton";

const LessonContentPage = () => {
  const { triggerConfetti } = useConfetti();
  const { lessonId } = useParams();
  const [updateLessonProgress, { isLoading }] =
    useUpdatelessonProgressMutation();

  const { data: lessonDetails, isLoading: LessonLoading } =
    useFetchUserEnrolledLessonContentQuery(lessonId as any);

  // Get the course id
  // @ts-ignore
  const courseId = lessonDetails?.data?.chapter?.course?.id;

  // Check if lesson is completed
  // @ts-ignore
  const isCompleted = lessonDetails?.data?.progress?.[0]?.isCompleted ?? false;

  if (LessonLoading) {
    return <LessonContentPageSkeleton />;
  }

  const handleLessonProgress = async (lessonId: string, courseId: string) => {
    try {
      const response = await updateLessonProgress({
        lessonId,
        courseId,
        isCompleted: true,
      });
      if (response.data?.success) {
        toast.success("Lesson marked as completed");
        triggerConfetti();
      } else {
        toast.error("Failed to mark lesson as completed");
      }
    } catch (error) {
      toast.error("An error occurred while updating lesson progress");
      console.error("Error updating lesson progress:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        videoKey={lessonDetails?.data?.videoKey ?? ""}
        thumbnailUrl={lessonDetails?.data?.thumbnailKey ?? ""}
      />

      {/* Action Button */}
      <div className="py-4 border-b">
        {isCompleted ? (
          <Button
            variant="outline"
            disabled
            className="flex items-center gap-2 bg-green-600 hover:bg-green-600 text-white cursor-default"
          >
            <CheckCircle className="size-4" />
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleLessonProgress(lessonId as string, courseId)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <CheckCircle className="size-4 text-green-600" />
            Mark as Completed
          </Button>
        )}
      </div>

      {/* Render lesson content */}
      <div className="space-y-2 pt-4">
        <h1 className="text-2xl font-bold text-slate-500 tracking-tight">
          {lessonDetails?.data?.title}
        </h1>

        {lessonDetails?.data?.description && (
          <RenderSubDescription
            json={JSON.parse(lessonDetails.data.description)}
          />
        )}
      </div>
    </div>
  );
};

export default LessonContentPage;
