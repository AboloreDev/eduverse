"use client";

import React from "react";
import Image from "next/image";
import { CourseLevel, CourseStatus } from "@/state/types/uploadTypes";
import { constructUrl } from "@/hooks/use-construct-url";
import { Tag } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { Progress } from "@/components/ui/progress";

export interface CourseProps {
  course: {
    id: string;
    title: string;
    subDescription: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    fileKey: string;
    slug: string;
    status: CourseStatus;
    level: CourseLevel;
  };
}

const CourseProgressCard = ({ course }: CourseProps) => {
  const thumbnailUrl = constructUrl(course.fileKey);

  const { totalLessons, completedLessons, progressPercentage } =
    //@ts-ignore
    useCourseProgress({ course });

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Advanced":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image with overlays */}
      <div className="relative">
        <Image
          src={thumbnailUrl}
          alt={course.title}
          width={600}
          height={400}
          className="w-full rounded-t-lg aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <Badge className=" backdrop-blur-sm shadow-sm">
            <Tag className="w-3 h-3 mr-1" />
            {course.category}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col space-y-2 px-4">
        {/* Title and Description */}
        <div>
          <h2 className="text-lg uppercase font-semibold line-clamp-2 hover:underline cursor-pointer group-hover:text-primary transition-colors">
            {course.title}
          </h2>
          <p className="text-sm line-clamp-2 mt-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Metadata with Icons */}
        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <p>Course Progress:</p>
            <p className="font-medium">{progressPercentage}% </p>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center gap-2">
            <p>Lesson Completed:</p>
            <p className="font-medium">
              {completedLessons}/{totalLessons}
            </p>
          </div>
        </div>

        {/* Status and Level Badges */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Badge className={`${getLevelColor(course.level)} text-xs`}>
            {course.level}
          </Badge>
        </div>

        {/* Learn more button */}
        <Link
          href={`/user/dashboard/${course.id}`}
          className={buttonVariants()}
        >
          Continue Watching
        </Link>
      </CardContent>
    </Card>
  );
};

export default CourseProgressCard;
