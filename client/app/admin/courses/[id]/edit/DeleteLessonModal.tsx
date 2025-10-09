"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDeleteLessonMutation } from "@/state/api/lessonsApi";
import { toast } from "sonner";

interface DeleteLessonModalProps {
  lessonId: string;
  lessonTitle: string;
  chapterId: string;
}

const DeleteLessonModal = ({
  lessonTitle,
  lessonId,
  chapterId,
}: DeleteLessonModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [deleteLesson, { isLoading }] = useDeleteLessonMutation();

  const handleCloseModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async () => {
    if (confirmValue.trim() !== lessonTitle.trim()) {
      toast.error("Lesson name does not match.");
      return;
    }

    try {
      const response = await deleteLesson({ chapterId, lessonId }).unwrap();
      if (response.success) {
        toast.success(
          `Lesson "${lessonTitle}" deleted and position re-ordered successfully.`
        );
        setIsOpen(false);
      } else {
        toast.error("Failed to delete lesson");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
      console.error("Something went wrong", error.data.message);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="outline">
          <Trash2Icon className="w-5 h-5 text-red-600 rounded-full" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm font-medium">
        <DialogHeader>
          <DialogTitle>Delete Lesson</DialogTitle>
          <DialogDescription>
            This action cannot be undone. <br />
            Please type{" "}
            <span className="font-semibold text-red-600">{lessonTitle}</span> to
            confirm deletion.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <Input
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
            placeholder={`Type "${lessonTitle}" to confirm`}
            className="placeholder:text-slate-500 focus:none"
          />
        </div>

        <DialogFooter className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLessonModal;
