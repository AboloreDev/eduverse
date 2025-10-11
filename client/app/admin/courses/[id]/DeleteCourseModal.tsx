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
import { useDeleteChapterMutation } from "@/state/api/chaptersApi";
import { toast } from "sonner";
import { useDeleteSingleCourseMutation } from "@/state/api/courseApi";

interface DeleteChapterModalProps {
  courseId: string;
  courseTitle: string;
}

const DeleteCourseModal = ({
  courseId,
  courseTitle,
}: DeleteChapterModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [deleteCourse, { isLoading }] = useDeleteSingleCourseMutation();

  const handleCloseModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async () => {
    if (confirmValue.trim() !== courseTitle.trim()) {
      toast.error("Course name does not match.");
      return;
    }

    try {
      const response = await deleteCourse(courseId).unwrap();
      if (response.success) {
        toast.success(`Course "${courseTitle}" deleted successfully.`);
        setIsOpen(false);
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
      console.error("Something went wrong", error.data.message);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogTrigger asChild>
        <Button className="gap-4 flex" variant="ghost">
          <Trash2Icon className="w-5 h-5 text-red-600 rounded-full" />
          <p>Delete Course</p>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm font-medium">
        <DialogHeader>
          <DialogTitle>Delete Course</DialogTitle>
          <DialogDescription>
            This action cannot be undone. <br />
            Please type{" "}
            <span className="font-semibold text-red-600">{courseTitle}</span> to
            confirm deletion.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <Input
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
            placeholder={`Type "${courseTitle}" to confirm`}
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

export default DeleteCourseModal;
