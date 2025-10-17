"use client";

import Container from "@/components/code/Container";
import { RenderSubDescription } from "@/components/code/Text Editor/RenderSubDescription";
import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";
import { useFetchSingleCourseQuery } from "@/state/api/courseApi";
import { IconCategory, IconChartBar, IconClock } from "@tabler/icons-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import CourseContentDisplay from "./CourseContentDisplay";
import UserSingleCourseSkeleton from "@/components/code/UserSingleCourseSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import UserEnrollmentCard from "./UserEnrollmentCard";

const UserSingleCourseDetailsPage = () => {
  const { id } = useParams();
  const courseId = id as string;
  const { data: singleCourse, isLoading } = useFetchSingleCourseQuery(courseId);

  function SafeRenderDescription({ description }: { description: string }) {
    try {
      const json =
        typeof description === "string" ? JSON.parse(description) : description;

      if (!json || typeof json !== "object") {
        return (
          <p className="text-sm text-slate-500">No description available</p>
        );
      }

      return <RenderSubDescription json={json} />;
    } catch (error) {
      console.error("Error rendering description:", error);
      return (
        <p className="text-sm text-slate-500">Unable to display description</p>
      );
    }
  }

  const image = `https://eduverselmsbucket.s3.us-east-1.amazonaws.com/${encodeURIComponent(
    // @ts-ignore
    singleCourse?.data?.fileKey
  )}`;

  if (isLoading) return <UserSingleCourseSkeleton />;

  return (
    <>
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-4">
          <div className="order-1 lg:col-span-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
              <Image
                src={image}
                alt="Course Image"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {singleCourse?.data?.title}
                </h1>
                <p className=" text-md md:text-lg text-slate-500 leading-relaxed line-clamp-2">
                  {singleCourse?.data?.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge className="flex items-center gap-1 px-3 py-1">
                  <IconChartBar className="size-4" />
                  <span>{singleCourse?.data?.level}</span>
                </Badge>
                <Badge className="flex items-center gap-1 px-3 py-1">
                  <IconCategory className="size-4" />
                  <span>{singleCourse?.data?.category}</span>
                </Badge>
                <Badge className="flex items-center gap-1 px-3 py-1">
                  <IconClock className="size-4" />
                  <span>{singleCourse?.data?.duration} hours</span>
                </Badge>
              </div>

              <Separator className="my-8" />

              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                  Course Description
                </h2>

                <div className="text-slate-500 text-md sm:text-lg">
                  <SafeRenderDescription
                    // @ts-ignore
                    description={singleCourse?.data?.subDescription}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="mt-12 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl  font-semibold tracking-tight">
                    Course Content
                  </h2>
                  <div className="text-sm md:text-lg ">
                    {singleCourse?.data?.chapters.length} Chapters |{" "}
                    {singleCourse?.data?.chapters.reduce(
                      (total, chapter) => total + chapter.lessons.length,
                      0
                    ) || 0}{" "}
                    {singleCourse?.data?.chapters?.lessons?.length !== 1
                      ? "Lessons"
                      : "Lesson"}
                  </div>
                </div>

                <div className="space-y-4">
                  {singleCourse?.data && (
                    <CourseContentDisplay singleCourse={singleCourse} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment card */}
          <div className="order-2 lg:col-span-1">
            <div className="sticky top-20">
              {singleCourse?.data && (
                <UserEnrollmentCard singleCourse={singleCourse} />
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default UserSingleCourseDetailsPage;
