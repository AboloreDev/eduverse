"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface UploadStatesProps {
  isDragActive: boolean;
}

const UploadStates = ({ isDragActive }: UploadStatesProps) => {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12">
        <CloudUploadIcon
          className={cn(
            " size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className=" text-slate-400">
        Drop your files here or{" "}
        <span className="text-blue-500">click to upload</span>
      </p>
      <Button className="mt-4" type="button">
        {" "}
        Select File
      </Button>
    </div>
  );
};

export default UploadStates;

export const UploadErrorState = () => {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 bg-destructive">
        <ImageIcon className={cn(" size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold text-slate-300">Upload Failed</p>
      <p className="text-xs mt-1 text-slate-300">Something went wrong</p>
      <Button type="button" className="mt-4 text-xs">
        Retry upload
      </Button>
    </div>
  );
};

export const ShowUploadedFileState = ({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: "image" | "video";
}) => {
  return (
    <div className="relative group w-full h-full flex items-center justify-center">
      {fileType === "video" ? (
        <video src={previewUrl} controls className="rounded-md w-full h-full" />
      ) : (
        <Image
          src={previewUrl}
          alt="Uploaded file"
          width={400}
          height={400}
          className="object-contain p-2"
        />
      )}
      <Button
        variant="destructive"
        type="button"
        size="icon"
        className={cn("absolute top-4 right-4")}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 size={4} className="animate-spin" />
        ) : (
          <X size={4} />
        )}
      </Button>
    </div>
  );
};

export const ShowUploadState = ({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) => {
  return (
    <div className="text-center  flex justify-center items-center flex-col">
      <p>{progress}</p>
      <p className="mt-q text-sm font-medium text-slate-700">Uploading...</p>
      <p className="mt-1 truncate text-slate-500 max-w-xs text-xs">
        {file.name}
      </p>
    </div>
  );
};
