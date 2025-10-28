"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Services = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h4 className="text-sm uppercase tracking-widest text-gray-400">
          Our Services
        </h4>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          Empowering Students and Instructors
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-3">
          Eduverse connects learners, educators, and institutions through
          intuitive tools and personalized learning experiences.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-emerald-950 text-white p-8 rounded-lg relative overflow-hidden"
        >
          <h3 className="text-xl font-semibold mb-4">Student Learning Hub</h3>
          <p className="text-gray-300 mb-6">
            Access structured lessons, real-time progress tracking, and
            interactive quizzes, all in one place to enhance your learning
            journey.
          </p>

          <div className="flex flex-wrap gap-2 mb-6 text-xs">
            {["Courses", "Assessments", "Certificates", "Mentorship"].map(
              (tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full ${
                    idx === 3
                      ? "bg-yellow-400 text-black font-medium"
                      : "border border-gray-400"
                  }`}
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <Button
            variant="secondary"
            className="bg-white text-black font-medium"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-lg overflow-hidden"
        >
          <Image
            src="/ai.jpg"
            alt="Instructor teaching online"
            width={800}
            height={600}
            className="object-cover w-full h-full rounded-lg"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
            <h3 className="text-xl font-semibold mb-2">
              Instructor Tools & Analytics
            </h3>
            <p className="text-gray-200 text-sm mb-4 max-w-md">
              Create, manage, and track your courses with advanced analytics to
              measure engagement and performance.
            </p>

            <div className="flex gap-3">
              <Button variant="secondary">Learn More</Button>
              <Button variant="default">Get Started</Button>
            </div>

            <div className="absolute bottom-4 right-6 bg-white/10 px-3 py-1 rounded text-xs">
              3.2K Active Learners
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
