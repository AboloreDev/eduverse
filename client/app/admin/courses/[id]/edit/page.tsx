"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseFormData } from "@/lib/schemas";
import {
  useEditCourseMutation,
  useFetchSingleCourseQuery,
} from "@/state/api/courseApi";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import EditCourseForm from "./EditCourseForm";
import CourseStructure from "./CourseStructure";
import { Loader2Icon } from "lucide-react";

const EditCoursePage = () => {
  const { id } = useParams();
  const courseId = id as string;
  const { data: courseData, isLoading: isFetchingCourse } =
    useFetchSingleCourseQuery(courseId);
  const [editCourse, { isLoading: editCourseLoading }] =
    useEditCourseMutation();
  const router = useRouter();
  const isLoading = editCourseLoading || isFetchingCourse;

  const handleCourseFormSubmit = async (data: CourseFormData) => {
    try {
      const response = await editCourse({ id: courseId, data }).unwrap();
      if (response.success) {
        toast.success("Course edited successfully");
        router.push("/admin/courses");
      } else {
        toast.error("Course editing failed");
      }
    } catch (error: any) {
      console.log("Editing error", error.message);
      toast.error("Something went wrong", error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center flex justify-center items-center">
        <Loader2Icon className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl fot-bold mb-8">
        Edit Course: <span className="text-primary underline"></span>
      </h1>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info </CardTitle>
              <CardDescription>
                Edit basic info about the couurse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm
                onSubmitCourse={handleCourseFormSubmit}
                courseData={courseData}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure </CardTitle>
              <CardDescription>Update your course structure</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure courseData={courseData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditCoursePage;
