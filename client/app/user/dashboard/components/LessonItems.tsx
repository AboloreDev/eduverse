import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface LessonItemsProps {
  lesson: {
    id: string;
    position: number;
    title: string;
    description: string;
  };
  id: string;
  isActive?: boolean;
  isLessonCompleted?: boolean;
}

const LessonItems = ({
  lesson,
  id,
  isActive,
  isLessonCompleted,
}: LessonItemsProps) => {
  const isCompleted = isLessonCompleted;

  return (
    <Link
      href={`/user/dashboard/${id}/${lesson.id}`}
      className={cn(
        buttonVariants({
          variant: isCompleted ? "secondary" : "outline",
          className: cn(
            "w-full p-2.5 h-auto justify-start items-center transition-all rounded-xl border shadow-sm text-sm font-medium group",
            isCompleted
              ? "bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-400 dark:border-green-700 hover:bg-green-300 dark:hover:bg-green-800 hover:text-green-900 dark:hover:text-green-100"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",

            isActive &&
              !isCompleted &&
              "bg-primary/20 dark:bg-primary/10 border-primary dark:border-primary hover:bg-primary/30 dark:hover:bg-primary/20 text-primary dark:text-primary"
          ),
        })
      )}
    >
      <div className="flex items-center gap-2.5 w-full min-w-0">
        <div className="shrink-0">
          <div
            className={cn(
              "size-5 rounded-full flex items-center justify-center border-2 transition-colors duration-200",
              isCompleted
                ? "border-green-600 dark:border-green-400 bg-green-500/10"
                : "border-slate-400 dark:border-slate-600"
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="size-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <Play
                className={cn(
                  "size-2.5 text-slate-500 dark:text-slate-400",
                  isActive ? "text-primary" : "text-slate-500"
                )}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col truncate flex-1 text-left min-w-0">
          <p className="text-xs font-medium truncate">
            {lesson.position}.{" "}
            <span
              className={cn(
                "font-semibold truncate",
                isActive ? "text-primary font-semibold" : "text-slate-500"
              )}
            >
              {lesson.title}
            </span>
          </p>
          {isCompleted && (
            <p className="text-xs text-green-700 dark:text-green-300 font-medium">
              Completed
            </p>
          )}

          {isActive && !isCompleted && (
            <p className="text-xs text-primary font-medium">
              Currently watching
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LessonItems;
