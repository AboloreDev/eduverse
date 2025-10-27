"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LessonFormData, lessonSchema } from "@/lib/schemas";
import { useCreateLessonMutation } from "@/state/api/lessonsApi";
import { useAppDispatch } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface NewLessonModalProps {
  courseId: string;
  chapterId: string;
}

const NewLessonModal = ({ courseId, chapterId }: NewLessonModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [createNewLesson, { isLoading }] = useCreateLessonMutation();

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
      chapterId: chapterId,
    },
  });

  const handleOpenChange = () => {
    if (!open) {
      form.reset();
    }
    setIsOpen(!isOpen);
  };

  const onSubmit = async (values: LessonFormData) => {
    try {
      // @ts-ignore
      const response = await createNewLesson(values).unwrap();

      if (response.success) {
        toast.success("Lesson creation successful");
        form.reset();
        setIsOpen(!isOpen);
      } else {
        toast.error("Failed to create lesson");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
      console.error("Something went wrong", error.data.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-bold" variant="outline">
          <Plus className="w-5 h-5" />
          New Lesson
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create new lesson</DialogTitle>
          <DialogDescription>
            What would you like to name your lesson?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter lesson name"
                      {...field}
                      className=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isLoading ? "Creating new lesson" : "Create lesson"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLessonModal;
