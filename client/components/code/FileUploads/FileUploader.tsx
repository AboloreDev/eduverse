"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import UploadStates, {
  ShowUploadedFileState,
  ShowUploadState,
  UploadErrorState,
} from "./UploadStates";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  useDeleteUploadFileMutation,
  useUploadFileMutation,
} from "@/state/api/uploadApi";
import { constructUrl } from "@/hooks/use-construct-url";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface ImageFormUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
}

const FileUploader = ({
  value,
  onChange,
  fileTypeAccepted,
}: ImageFormUploadProps) => {
  const [uploadFileController] = useUploadFileMutation();
  const [deleteUploadFile] = useDeleteUploadFileMutation();
  const fileUrl = value ? constructUrl(value) : "";
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    isDeleting: false,
    progress: 0,
    uploading: false,
    fileType: fileTypeAccepted,
    key: value,
    objectUrl: fileUrl,
  });

  const uploadFile = async (file: File) => {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const result = await uploadFileController({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        isImage: fileTypeAccepted === "image" ? true : false,
      }).unwrap();

      if (!result.success) {
        toast.error("Failed to get upload URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));

        return;
      }

      const { preSignedUrl, key } = result.data as {
        preSignedUrl: string;
        key: string;
      };

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const uploadProgress = (event.loaded / event.total) * 100;

            setFileState((prev) => ({
              ...prev,
              uploading: true,
              progress: Math.round(uploadProgress),
              error: false,
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 100,
              error: false,
              key: key,
              objectUrl: constructUrl(key),
            }));
            onChange?.(key);
            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => {
          reject(
            new Error(`Network error during upload. Status: ${xhr.status}`)
          );
          reject(new Error("Upload failed"));
        };

        xhr.open("PUT", preSignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("Something went wrong");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          id: uuidv4(),
          isDeleting: false,
          error: false,
          fileType: fileTypeAccepted,
        });
        uploadFile(file);
      }
    },
    [fileState.objectUrl, uploadFile, fileTypeAccepted]
  );

  const rejectedFiles = (fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileTooLarge = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1");
      }

      if (fileTooLarge) {
        toast.error("File too large, max is 5mb");
      }
    }
  };

  const renderContent = () => {
    if (fileState.uploading) {
      return (
        <ShowUploadState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }

    if (fileState.error) {
      return <UploadErrorState />;
    }

    if (fileState.objectUrl) {
      return (
        <ShowUploadedFileState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
          fileType={fileState.fileType}
        />
      );
    }

    return <UploadStates isDragActive={isDragActive} />;
  };

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  useEffect(() => {
    if (value && value !== fileState.key) {
      setFileState((prev) => ({
        ...prev,
        key: value,
        objectUrl: constructUrl(value),
      }));
    }
  }, [value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      await deleteUploadFile(fileState.key as string).unwrap();

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
      onChange?.("");
      setFileState((prev) => ({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        fileType: fileTypeAccepted,
        id: null,
        error: false,
        isDeleting: false,
      }));

      toast.success("File removed successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border border-dashed transition-colors duration-200 ease-in-out hover:border-primary p-6 text-center w-full cursor-pointer",
        isDragActive && "border-primary bg-gray-50"
      )}
    >
      <CardContent className="flex items-center justify-center p-4 h-full w-full">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
