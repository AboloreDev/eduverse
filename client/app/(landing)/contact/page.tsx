"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer:
      "Simply create an account, browse available courses, and click the 'Enroll Now' button on your chosen course page.",
  },
  {
    question: "Can I access my courses on mobile devices?",
    answer:
      "Yes, Learnora is fully responsive, allowing you to learn anytime and anywhere using your phone, tablet, or laptop.",
  },
  {
    question: "Do you offer certificates after course completion?",
    answer:
      "Absolutely. Upon successful completion of a course, you’ll receive a digital certificate that you can download or share.",
  },
  {
    question: "How can instructors publish their courses?",
    answer:
      "Instructors can sign up, complete their profile, and upload course materials through the instructor dashboard for admin approval.",
  },
  {
    question: "Is there support available for technical issues?",
    answer:
      "Yes, our support team is available 24/7 via email and chat to help you resolve any technical or account-related issues.",
  },
  {
    question: "Can I request a refund for a course?",
    answer:
      "Yes, we offer refunds within 7 days of purchase, provided less than 20% of the course has been completed.",
  },
];

const ContactPage = () => {
  return (
    <div className="prata-regular">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <Image
          src="/conatct.jpg"
          alt="Students learning online"
          fill
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-sm md:text-base mt-2">
            Empowering Learners. Supporting Educators.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-2">Get In Touch</h2>
          <h3 className="text-3xl font-bold mb-4">We’re Here to Help</h3>
          <p className="text-gray-500 mb-6">
            Whether you’re a student, instructor, or institution partner — our
            support team is here to guide you every step of the way.
          </p>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-black dark:text-white" />
              90 Ikoyi, Lagos, Nigeria
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-black dark:text-white" />
              +234 812 345 6789
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-black dark:text-white" />
              support@eduverse.ng
            </li>
          </ul>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-100 dark:bg-zinc-800 p-6 rounded-lg shadow-lg space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="p-3 rounded border text-sm w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-3 rounded border text-sm w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded border text-sm w-full"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="p-3 rounded border text-sm w-full"
            />
          </div>
          <textarea
            placeholder="How can we assist you?"
            className="w-full p-3 rounded text-sm border min-h-[120px]"
          ></textarea>
          <Button
            variant="outline"
            type="submit"
            className="px-6 py-3 rounded transition"
          >
            Send Message
          </Button>
        </motion.form>
      </section>

      {/* FAQ Section */}
      <section className="bg-zinc-100 dark:bg-zinc-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-xl font-medium uppercase mb-2">FAQ</h2>
          <h4 className="text-lg font-bold">Frequently Asked Questions</h4>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Have a question? We’ve compiled answers to help you get started
            quickly and confidently.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((item, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left text-sm md:text-base font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-gray-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
