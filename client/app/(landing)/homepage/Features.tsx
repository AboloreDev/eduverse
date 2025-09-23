import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Play, BookOpen } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Expert Instructors",
    description: "Industry professionals with years of experience",
    icon: Users,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    title: "Certificates",
    description: "Verified certificates upon course completion",
    icon: Award,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 3,
    title: "Lifetime Access",
    description: "Learn at your own pace with unlimited access",
    icon: Play,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  {
    id: 4,
    title: "Interactive Learning",
    description: "Hands-on projects and real-world applications",
    icon: BookOpen,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
  },
];

const Features = () => {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm rounded-xl"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-black group-hover:text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
