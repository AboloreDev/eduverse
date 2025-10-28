import { Ban } from "lucide-react";
import React from "react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EmptyStates = ({
  title,
  description,
  buttonText,
  href,
}: {
  title: string;
  description: string;
  buttonText?: string;
  href: string;
}) => {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md borded-dashed border p-8 text-center animate-in fade-in-50">
      <div>
        <Ban className="size-10 text-primary" />
      </div>

      <h2 className="mt-6 text-4xl font-semibold">{title}</h2>
      <h2 className="mb-8 text-center mt-2 leading-tight text-sm font-semibold text-slate-500">
        {description}
      </h2>
      <Link href={href} className={cn(buttonVariants())}>
        {buttonText}
      </Link>
    </div>
  );
};

export default EmptyStates;
