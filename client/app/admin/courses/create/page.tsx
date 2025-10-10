"use client";

import FileUploader from "@/components/code/FileUploads/FileUploader";
import Tiptap from "@/components/code/Text Editor/Tiptap";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CourseFormData,
  courseLevels,
  courseSchema,
  courseStatus,
} from "@/lib/schemas";
import { useCreateCourseMutation } from "@/state/api/uploadApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, SparklesIcon, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";

const CourseCreationPage = () => {
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const router = useRouter();
  const form = useForm<CourseFormData>({
    // @ts-ignore
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      subDescription: "",
      category: "",
      price: 0,
      duration: 0,
      fileKey: "",
      level: "Beginner",
      status: "Draft",
      slug: "",
    },
  });

  const handleCourseFormSubmit = async (data: CourseFormData) => {
    try {
      const response = await createCourse(data).unwrap();
      if (response.success) {
        toast.success("Course sreated successfully");
        router.push("/admin/courses");
      } else {
        toast.error("Course creation failed");
      }
    } catch (error: any) {
      console.log("Creation error", error.message);
      toast.error("Sometjing went wrong", error.message);
    }
  };

  return (
    <>
      <div className="flex items-center gap-6">
        <Link href={"/admin/courses"} className={buttonVariants()}>
          <ArrowLeft size={4} />
          <p className="">Back to courses</p>
        </Link>

        <h1 className="text-3xl font-semibold">Create a new course</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new course. All fields
              marked with * are required.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                //   @ts-ignore
                onSubmit={form.handleSubmit(handleCourseFormSubmit)}
                className="space-y-6"
              >
                {/* Course Title */}
                <FormField
                  //   @ts-ignore
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter course title..."
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-500">
                        This will be the main title displayed for your course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Course Description */}
                <FormField
                  //   @ts-ignore
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed description of your course..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-slate-500">
                        Detailed description that will appear on the course page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Course Sub Description */}
                <FormField
                  //   @ts-ignore
                  control={form.control}
                  name="subDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Tiptap field={field} />
                      </FormControl>
                      <FormDescription className="text-slate-500">
                        Short summary displayed in course listings and previews
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Grid Layout for smaller fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <FormField
                    //   @ts-ignore
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Web Development, Design..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          Course category for organization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Course Level */}
                  <FormField
                    //   @ts-ignore
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Level *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select course level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-500">
                          Target skill level for students
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <FormField
                    //   @ts-ignore
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Price in USD"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;

                              field.onChange(
                                value === "" ? 0 : parseFloat(value) || 0
                              );
                            }}
                            min="1"
                            step="0.01"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          Course price in USD (minimum $1)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Duration */}
                  <FormField
                    //   @ts-ignore
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (hours) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Duration in hours"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;

                              field.onChange(
                                value === "" ? 0 : parseFloat(value) || 0
                              );
                            }}
                            min="1"
                            step="0.5"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          Course duration in hours (minimum 1 hour)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug */}
                  <FormField
                    //   @ts-ignore
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Slug *</FormLabel>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input placeholder="course-url-slug" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const title = form.getValues("title");
                              const slug = slugify(title);

                              form.setValue("slug", slug, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <SparklesIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormDescription className="text-slate-500">
                          URL-friendly version of the course title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    //   @ts-ignore
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Status *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select course status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseStatus.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-500">
                          Current status of the course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Upload Field */}
                <FormField
                  //   @ts-ignore
                  control={form.control}
                  name="fileKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Thumbnail</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onChange={field.onChange}
                          fileTypeAccepted="image"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-500">
                        Upload a thumbnail image for your course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 items-end justify-end">
                  <Button disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Course"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Reset Form
                  </Button>

                  <Link
                    href="/admin/courses"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Card>
    </>
  );
};

export default CourseCreationPage;
