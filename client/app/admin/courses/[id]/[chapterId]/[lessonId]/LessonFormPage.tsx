"use client";

import React, { useEffect } from "react";
import {
  useFetchSingleLessonQuery,
  useUpdateLessonMutation,
} from "@/state/api/lessonsApi";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LessonFormData, lessonSchema } from "@/lib/schemas";
import Tiptap from "@/components/code/Text Editor/Tiptap";
import FileUploader from "@/components/code/FileUploads/FileUploader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LessonFormProps {
  courseId: string;
  chapterId: string;
  lessonId: string;
}

const LessonFormPage = ({ courseId, chapterId, lessonId }: LessonFormProps) => {
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
  const { data: fetchSingleLesson, isLoading: isFetching } =
    useFetchSingleLessonQuery({
      chapterId,
      courseId,
      lessonId,
    });
  const router = useRouter();

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnailKey: "",
      videoKey: "",
      courseId,
      chapterId,
    },
  });

  // Populate form fields once data is fetched
  useEffect(() => {
    if (fetchSingleLesson?.data) {
      form.reset({
        name: fetchSingleLesson.data.title || "",
        description: fetchSingleLesson.data.description || "",
        thumbnailKey: fetchSingleLesson.data.thumbnailKey || "",
        videoKey: fetchSingleLesson.data.videoKey || "",
        courseId,
        chapterId,
      });
    }
  }, [fetchSingleLesson, form, courseId, chapterId]);

  const onSubmit = async (values: LessonFormData) => {
    try {
      const response = await updateLesson({
        courseId,
        chapterId,
        lessonId,
        data: {
          name: values.name,
          description: values.description ?? "",
          thumbnailKey: values.thumbnailKey ?? "",
          videoKey: values.videoKey ?? "",
        },
      }).unwrap();

      if (response.success) {
        toast.success("Lesson updated successfully!");
        router.push(`/admin/courses/${courseId}/edit`);
      } else {
        toast.error("Failed to update lesson.");
      }
    } catch (error: any) {
      console.error("Something went wrong", error.message);
      toast.error("Something went wrong");
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2Icon className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Lesson Configuration</CardTitle>
        <CardDescription>
          Configure the video and description for this lesson.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lesson title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnailKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      onChange={field.onChange}
                      value={field.value}
                      fileTypeAccepted="image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video</FormLabel>
                  <FormControl>
                    <FileUploader
                      onChange={field.onChange}
                      value={field.value}
                      fileTypeAccepted="video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating} className="w-fit">
                {isUpdating ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Saving Lesson
                  </>
                ) : (
                  "Save Lesson"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LessonFormPage;
