import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import Image from "next/image";
import { CourseLevel, CourseStatus } from "@/state/types/uploadTypes";
import { constructUrl } from "@/hooks/use-construct-url";

import { FileStack, School, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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

const UsersCourseCard = ({ course }: CourseProps) => {
  const thumbnailUrl = constructUrl(course.fileKey);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

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

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case "Published":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "Draft":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "Archived":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
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

        {/* Price Tag - Top Right */}
        <div className="absolute top-3 right-3">
          <div className="bg-primary px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
            {course.price === 0 ? "Free" : formatPrice(course.price)}
          </div>
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
        <div className="flex items-center gap-x-4 pt-2">
          <div className="flex items-center space-x-1.5">
            <div className=" p-1 rounded">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm text-slate-600">{course.duration}hr</p>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className=" p-1 rounded">
              <School className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-sm text-slate-600">{course.level}</p>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="p-1 rounded">
              <FileStack className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-sm text-slate-600">{course.status}</p>
          </div>
        </div>

        {/* Status and Level Badges */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Badge className={`${getLevelColor(course.level)} text-xs`}>
            {course.level}
          </Badge>
        </div>

        {/* Learn more button */}
        <Link href={`/user/courses/${course.id}`} className={buttonVariants()}>
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
};

export default UsersCourseCard;
