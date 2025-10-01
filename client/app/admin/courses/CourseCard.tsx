import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import Image from "next/image";
import { CourseLevel, CourseStatus } from "@/state/types/uploadTypes";
import { constructUrl } from "@/hooks/use-construct-url";
import Link from "next/link";
import {
  EyeIcon,
  FileStack,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CourseProps {
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

const CourseCard = ({ course }: CourseProps) => {
  const thumbnailUrl = constructUrl(course.fileKey);
  return (
    <Card className="group relative">
      {/* Drop down */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical size={4} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 space-y-2">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/edit`}>
                <Pencil className="size-4 mr-2" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.slug}`}>
                <EyeIcon className="size-4 mr-2" />
                Preview Course
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/delete`}>
                <Trash2 className="size-4 text-destructive mr-2" />
                Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Image
        src={thumbnailUrl}
        alt="Thumbnail Url"
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent className="flex flex-col space-y-2 p-2">
        <div>
          <h2 className="text-lg font-semibold line-clamp-2 hover:underline">
            {course.title}
          </h2>
          <p className="text-sm text-slate-500 line-clamp-2 mt-2 leading-tight">
            {course.description}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center space-x-2">
            <TimerIcon className="size-6 rounded-md" />
            <p className="text-sm text-slate-500">{course.duration}hr</p>
          </div>
          <div className="flex items-center space-x-2">
            <School className="size-6 rounded-md" />
            <p className="text-sm text-slate-500">{course.level}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FileStack className="size-6 rounded-md" />
            <p className="text-sm text-slate-500">{course.status}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Link
            href={`/admin/courses/${course.id}/edit`}
            className={cn(buttonVariants(), "w-1/2")}
          >
            Edit Course
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
