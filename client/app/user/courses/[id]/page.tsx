"use client";

import Container from "@/components/code/Container";
import Navbar from "@/components/code/Navbar";
import { RenderSubDescription } from "@/components/code/Text Editor/RenderSubDescription";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { constructUrl } from "@/hooks/use-construct-url";
import { useFetchSingleCourseQuery } from "@/state/api/courseApi";
import { Collapsible } from "@radix-ui/react-collapsible";
import {
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const UserSingleCourseDetailsPage = () => {
  const { id } = useParams();
  const courseId = id as string;
  const { data: singleCourse, isLoading } = useFetchSingleCourseQuery(courseId);

  console.log(singleCourse);

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

  console.log(image);
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
                <h1 className="text-4xl font-bold tracking-tight">
                  {singleCourse?.data?.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
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
                <h2 className="text-3xl font-semibold tracking-tight">
                  Course Description
                </h2>

                <div>
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
                  <h2 className="text-3xl font-semibold tracking-tight">
                    Course Content
                  </h2>
                  <div>
                    {singleCourse?.data?.chapters.length} Chapters |{" "}
                    {singleCourse?.data?.chapters.reduce(
                      (total, chapter) => total + chapter.lessons.length,
                      0
                    ) || 0}{" "}
                    {singleCourse?.data.chapters?.lessons?.length !== 1
                      ? "Lessons"
                      : "Lesson"}
                  </div>
                </div>

                <div className="space-y-4">
                  {singleCourse?.data?.chapters.map((chapter, index) => (
                    <Collapsible key={chapter.id} defaultOpen>
                      <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md">
                        <CollapsibleTrigger>
                          <div>
                            <CardContent className="p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 ">
                                  <p className="flex size-10 items-center justify-center rounded-full bg-primary">
                                    {index + 1}
                                  </p>
                                  <div>
                                    <h4 className=" font-semibold text-left">
                                      {chapter.title}
                                    </h4>
                                    <p className="text-sm text-slate-500 text-left">
                                      {chapter.lessons.length}{" "}
                                      {chapter.lessons.length !== 1
                                        ? "lessons"
                                        : "lesson"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline">
                                    {chapter.lessons.length}{" "}
                                    {chapter.lessons.length !== 1
                                      ? "lessons"
                                      : "lesson"}
                                  </Badge>

                                  <IconChevronDown className="size-5 text-slate-500"></IconChevronDown>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </CollapsibleTrigger>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default UserSingleCourseDetailsPage;
