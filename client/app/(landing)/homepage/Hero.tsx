import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, BookOpen, Users, Award, ArrowRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-32 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-16 h-16 bg-indigo-200 rounded-full opacity-25 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen">
          {/* Left Side - Content */}
          <div className="space-y-8 text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>Trusted by 50,000+ Students</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-6xl font-bold text-gray-900 dark:text-gray-200 leading-tight">
                Master New Skills with <span className="">Expert-Led</span>{" "}
                Courses
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Join thousands of learners who have transformed their careers
                through our comprehensive online learning platform. Learn at
                your own pace with industry experts.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold ">500+</div>
                <div className="text-sm text-gray-500">Courses</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold ">50K+</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold ">98%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center bg-black text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/"
                className="group inline-flex items-center justify-center border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md bg-white hover:bg-gray-50"
              >
                <Play className="w-5 h-5 mr-2" />
                Explore Courses
              </Link>
            </div>
          </div>

          {/* Right Side - Image/Illustration */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full">
                <div className="aspect-[4/5] relative">
                  {/* Uncomment and use this when you have an actual image */}

                  <Image
                    src="/hero1.jpg"
                    alt="Students learning online"
                    width={400}
                    height={400}
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute z-100 -top-6 -left-6 bg-white shadow-lg rounded-2xl p-4 animate-bounce delay-500 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 ">
                    Live Classes
                  </span>
                </div>
              </div>

              <div className="absolute z-100 -bottom-6 -right-6 bg-white shadow-lg rounded-2xl p-4 animate-bounce delay-1000 hidden md:block">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Certificate Ready
                    </div>
                    <div className="text-xs text-gray-500">Complete & Earn</div>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl scale-110 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
