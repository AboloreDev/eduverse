"use client";

import Container from "@/components/code/Container";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <Container>
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto prata-regular">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">About Eduverse</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We&apos;re redefining the way people learn, teach, and grow.
            Discover the story behind our platform and how we&apos;re empowering
            learners and educators worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden shadow"
          >
            <Image
              src="/about.jpg"
              alt="Students learning online"
              width={800}
              height={600}
              className="w-full h-96 object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-slate-400 mb-4">
              At Eduverse, our mission is to make quality education accessible
              to everyone, everywhere. We believe learning should be engaging,
              flexible, and tailored to each individual&apos;s goals.
            </p>
            <p className="text-slate-400 mb-4">
              We combine innovation, technology, and expert-driven content to
              create a learning environment that empowers both students and
              instructors. From interactive lessons to real-time progress
              tracking, every feature is designed to help you succeed.
            </p>
            <p className="text-slate-400">
              Whether you&apos;re upskilling, teaching, or exploring new
              knowledge areas, Eduverse is your trusted platform to achieve
              meaningful learning outcomes.
            </p>
          </motion.div>
        </div>
      </section>
    </Container>
  );
};

export default AboutPage;
