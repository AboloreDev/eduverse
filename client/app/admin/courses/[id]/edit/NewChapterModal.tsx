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
import { ChapterFormData, chapterSchema } from "@/lib/schemas";
import { useCreateChapterMutation } from "@/state/api/chaptersApi";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { setIsOpen } from "@/state/slice/chapterSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface NewChapterModalProps {
  courseId: string;
}

const NewChapterModal = ({ courseId }: NewChapterModalProps) => {
  const isOpen = useAppSelector((state) => state.chapter.isOpen);
  const dispatch = useAppDispatch();
  const [createNewChapter, { isLoading }] = useCreateChapterMutation();

  const form = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
    },
  });

  const handleOpenChange = () => {
    if (!open) {
      form.reset();
    }
    dispatch(setIsOpen());
  };

  const onSubmit = async (values: ChapterFormData) => {
    try {
      const response = await createNewChapter(values).unwrap();

      if (response.success) {
        toast.success("Chapter creation successful");
        form.reset();
        dispatch(setIsOpen());
      } else {
        toast.error("Failed to create chapter");
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
          New Chapter
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create new chapter</DialogTitle>
          <DialogDescription>
            What would you like to name your chapter?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter chapter name"
                      {...field}
                      className="focus-visible:ring-2 focus-visible:ring-offset-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isLoading ? "Creating new chapter" : "Create Chapter"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChapterModal;
