"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface SettingsFormprops {
  initialData: {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
  };
  onSubmit: any;
  isLoading: boolean;
}

const Settings = ({ initialData, onSubmit, isLoading }: SettingsFormprops) => {
  // state
  const [editMode, setEditMode] = useState(false);
  // using reach hook form and zod resolvers
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  // toggle the edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      form.reset(initialData);
    }
  };

  // handle submit to submit form
  const handleSubmit = async (data: SettingsFormData) => {
    await onSubmit(data);
    setEditMode(false);
  };

  return (
    <div className="p-4 flex items-center justify-center flex-col space-y-6">
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-2xl prata-regular"> Settings</h1>
        <p className="nunito text-md text-neutral-500">
          Manage your account preferences and personal information
        </p>
      </div>

      <Form {...form}>
        <form
          className="w-full md:w-1/2 p-2"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Card>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1 px-6 py-2">
                  <Label className="font-bold">First Name:</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="John "
                      disabled={!editMode}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1 px-6 py-2">
                  <Label className="font-bold">Last Name:</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Doe"
                      disabled={!editMode}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1 px-6 py-2">
                  <Label className="font-bold">Email:</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="@gmail.com"
                      disabled={!editMode}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Button */}
            <div className="p-4 w-full flex items-center justify-between">
              <Button className="w-1/4" type="button" onClick={toggleEditMode}>
                {editMode ? "Cancel" : "Edit"}
              </Button>
              {editMode && (
                <Button className="w-1/2" type="submit" disabled={isLoading}>
                  {isLoading ? "Updating" : "Save Changes"}
                </Button>
              )}
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Settings;
