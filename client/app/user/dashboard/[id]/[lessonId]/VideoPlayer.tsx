import { constructUrl } from "@/hooks/use-construct-url";
import { BookIcon } from "lucide-react";
import React from "react";

const VideoPlayer = ({
  videoKey,
  thumbnailUrl,
}: {
  videoKey: string;
  thumbnailUrl: string;
}) => {
  const videoUrl = constructUrl(videoKey);
  const thumbnailKey = constructUrl(thumbnailUrl);

  if (!videoKey) {
    return (
      <div className="aspect-video bg-muted flex items-center flex-col justify-center rounded-md">
        <BookIcon className="size-14 mr-2 text-primary" />
        <p className="text-slate-500">This lesson does not have a video yet</p>
      </div>
    );
  }
  return (
    <div className="aspect-video bg-black rounded-md overflow-hidden relative">
      <video
        className="w-full h-full object-cover"
        controls
        poster={thumbnailKey}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        <source src={videoUrl} type="video/MOV" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
