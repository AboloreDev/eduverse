import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { IconChevronDown, IconPlayerPlay } from "@tabler/icons-react";
import { SingleCourseResponse } from "@/state/types/courseTypes";

interface SingleCourseProps {
  singleCourse: SingleCourseResponse<object>;
}

const CourseContentDisplay = ({ singleCourse }: SingleCourseProps) => {
  return (
    <div>
      {singleCourse?.data?.chapters.map((chapter, index) => (
        <Collapsible key={chapter.id} defaultOpen>
          <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
            <CollapsibleTrigger>
              <div>
                <CardContent className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 ">
                      <p className="flex size-10 items-center justify-center rounded-full bg-primary">
                        {index + 1}
                      </p>
                      <div>
                        <h4 className="text-sm md:text-md  font-semibold text-left">
                          {chapter.title}
                        </h4>
                        <p className="text-sm text-slate-500 text-left">
                          {chapter.lessons.length}{" "}
                          {chapter.lessons.length !== 1 ? "lessons" : "lesson"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {chapter.lessons.length}{" "}
                        {chapter.lessons.length !== 1 ? "lessons" : "lesson"}
                      </Badge>

                      <IconChevronDown className="size-5 cursor-pointer text-slate-500"></IconChevronDown>
                    </div>
                  </div>
                </CardContent>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-top">
                <div className="p-4 pt-2 space-y-3">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex items-cener gap-4 p-3 hover:bg-accent transition-colors group"
                    >
                      <div className="flex size-8 items-center justify-center bg-background border-2 border-primary/50 rounded-full">
                        <IconPlayerPlay className="size-4 text-slate-500 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{lesson.title}</p>
                        <p className="text-xs text-slate-500 ">
                          {lessonIndex + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
};

export default CourseContentDisplay;
