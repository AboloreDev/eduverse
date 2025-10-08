"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { ReactNode, useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Loader2Icon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useReOrderLessonsMutation } from "@/state/api/lessonsApi";
import { useReOrderChaptersMutation } from "@/state/api/chaptersApi";

interface CourseStructureProps {
  courseId: string;
  courseData?: any;
  isLoading?: boolean;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string; // only relevant for lessons=
  };
}

const CourseStructure = ({
  courseId,
  courseData,
  isLoading,
}: CourseStructureProps) => {
  const [reOrderLessonsApi] = useReOrderLessonsMutation();
  const [reOrderChaptersApi] = useReOrderChaptersMutation();

  if (isLoading) {
    return (
      <div className="text-center flex justify-center items-center">
        <Loader2Icon className="animate-spin w-6 h-6" />
      </div>
    );
  }
  // Structure arrays of the chapter and lessons from the backend
  // Arrange them properly for the drag and drop
  const initialItems = courseData?.data?.chapters?.map((chapter: any) => ({
    id: chapter.id,
    title: chapter.title,
    order: chapter.position,
    isOpen: true, // set chapter default to true
    lessons: chapter.lessons.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      thumbnailKey: lesson.thumbnailKey,
      videoKey: lesson.videoKey,
      order: lesson.position,
    })),
  }));

  // set the structure array state as the initial state
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems((prevItems: any) => {
      const updatedItems = courseData.chapter.map((chapter: any) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen:
          prevItems.find((item: any) => item.id === chapter.id)?.isOpen ?? true,
        lessons: chapter.lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          thumbnailKey: lesson.thumbnailKey,
          videoKey: lesson.videoKey,
          order: lesson.position,
        })),
      }));
    });
  }, [courseData]);

  // Sortable item function copied from dndkit website
  function SortableItem({ children, id, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

  // handleDrgEnd function copied from dndkit documentation
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = courseData.data.id;

    if (activeType === "chapter") {
      let targetChapterId = null;

      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error("Could not determine the chapter for ordering");
        return;
      }

      const oldIndex = items.findIndex((item: any) => item.id === activeId);
      const newIndex = items.findIndex(
        (item: any) => item.id === targetChapterId
      );

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Could not find chapter old/new for re-ordering");

        return;
      }

      const reOrderedLocalChapters = arrayMove(items, oldIndex, newIndex);

      const updatedChaperState = reOrderedLocalChapters.map(
        (chapter, index) => ({
          // @ts-ignore
          ...chapter,
          order: index + 1,
        })
      );

      const previousItems = [...items];

      setItems(updatedChaperState);

      if (courseId) {
        const chaptersToUpdate = updatedChaperState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));

        toast.promise(
          reOrderChaptersApi({
            courseId,

            chapters: chaptersToUpdate,
          }).unwrap(),
          {
            loading: "Reordering Chapters...",
            success: (result: any) => {
              return "Chapters Updated Successfully";
            },
            error: (error: any) => {
              // Rollback UI on error
              setItems(previousItems);
              return error?.data?.message || "Failed to reorder chapters";
            },
          }
        );
      }

      return;
    }

    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error(
          "Lesson move between different chapters or invalid chapter ID is not allowed"
        );
        return;
      }

      const chapterIndex = items.findIndex(
        (chapter: any) => chapter.id === chapterId
      );

      if (chapterIndex === -1) {
        toast.error("Could not find chapter fpr lesson");
        return;
      }

      const chapterToUpdate = items[chapterIndex];

      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson: any) => lesson.id === activeId
      );

      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson: any) => lesson.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Could not lesson for re-ordering");
        return;
      }

      const reOrderedLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const updatedLessonState = reOrderedLessons.map((lessons, index) => ({
        // @ts-ignore
        ...lessons,
        order: index + 1,
      }));

      const newItems = [...items];

      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonState,
      };

      const previousItems = [...items];

      setItems(newItems);

      if (courseId) {
        const lessonToUpdate = updatedLessonState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        toast.promise(
          reOrderLessonsApi({
            courseId,
            chapterId,
            lessons: lessonToUpdate,
          }).unwrap(),
          {
            loading: "Reordering Lessons...",
            success: (result: any) => {
              return "Lessons Updated Successfully";
            },
            error: (error: any) => {
              // Rollback UI on error
              setItems(previousItems);
              return error?.data?.message || "Failed to reorder lessons";
            },
          }
        );
      }

      return;
    }
  }

  const toggleChapter = (chapterId: string) => {
    setItems(
      items.map((chapter: any) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  };

  // sensors copied fromd dndkit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((item: any) => (
              <SortableItem
                key={item.id} // ✅ unique key for each chapter
                id={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card>
                    {" "}
                    {/* ✅ extra safeguard key */}
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-1 rounded cursor-grab active:cursor-grabbing"
                            {...listeners}
                          >
                            <GripVertical className="w-5 h-5" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon">
                              {item.isOpen ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary">
                            {item.title}
                          </p>
                        </div>
                        <Button variant="outline" size="icon">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </div>

                      {/* Lessons */}
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            strategy={verticalListSortingStrategy}
                            items={item.lessons?.map(
                              (lesson: any) => lesson.id
                            )}
                          >
                            {item.lessons?.map((lesson: any) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        {...lessonListeners}
                                      >
                                        <GripVertical className="w-5 h-5" />
                                      </Button>
                                      <FileText className="w-5 h-5" />
                                      <Link
                                        href={`/admin/courses/${courseId}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <Button variant="outline" size="icon">
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>

                          {/* Add Lesson Button */}
                          <div className="p-1 mt-4 w-full flex justify-end">
                            <Button>+ Create New Lesson</Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};

export default CourseStructure;
