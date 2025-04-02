"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BlogPostModal from "@/components/BlogPostModal";

// Scroll-triggered animation section
function AnimatedSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const blogPosts = {
  obedience: {
    title: "Mastering Basic Obedience: The Foundation of a Well-Behaved Dog",
    content: [
      "Welcome to the exciting world of dog obedience training! In this comprehensive session, we'll transform your furry friend into a model citizen. Our expert trainers will guide you through the essential commands that every dog should know, from the classic 'sit' and 'stay' to more advanced behaviors that will make your dog the envy of the neighborhood.",
      "What makes our obedience training special is our unique approach that combines positive reinforcement with fun, engaging exercises. We believe that training should be as enjoyable for your dog as it is effective. You'll learn how to communicate with your dog in a way that builds trust and strengthens your bond.",
      "By the end of this session, your dog will not only master basic commands but also develop better impulse control and social skills. We'll also cover common obedience challenges and how to handle them with patience and understanding. Get ready to see your dog's confidence soar as they master each new skill!"
    ]
  },
  agility: {
    title: "Agility Training: Unleash Your Dog's Inner Athlete",
    content: [
      "Get ready for an action-packed adventure in dog agility training! This exciting session will transform your dog into a nimble, confident athlete while strengthening your bond through teamwork and trust. Our state-of-the-art agility course is designed to challenge and inspire dogs of all skill levels.",
      "What sets our agility training apart is our focus on building your dog's confidence while having a blast. We'll guide you through the fundamentals of agility, from basic jumps and tunnels to more complex obstacles. Each exercise is carefully designed to develop your dog's coordination, speed, and problem-solving abilities.",
      "But it's not just about the physical challenges – agility training is also a fantastic way to improve your dog's mental sharpness and focus. You'll learn how to read your dog's body language and communicate effectively during high-speed runs. Whether you're looking to compete or just want to have fun with your dog, this session will leave you both wanting more!"
    ]
  },
  behavior: {
    title: "Behavior Modification: Understanding and Transforming Your Dog's Actions",
    content: [
      "Dive deep into the fascinating world of dog behavior modification! This transformative session will help you understand why your dog acts the way they do and how to guide them toward better behavior. Our expert trainers will share insights into canine psychology and effective training techniques.",
      "What makes our behavior modification approach unique is our commitment to understanding the root cause of unwanted behaviors. We'll explore everything from separation anxiety to leash reactivity, providing you with practical solutions that work. Our positive reinforcement methods ensure that your dog learns new behaviors while maintaining their trust and enthusiasm.",
      "By the end of this session, you'll have a toolkit of strategies to address common behavioral challenges. We'll also discuss how to create a supportive environment that encourages good behavior and prevents future issues. Get ready to see your relationship with your dog transform as you both learn and grow together!"
    ]
  }
};

export default function EventsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPost, setSelectedPost] = useState<keyof typeof blogPosts | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--scooby-gold)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ${
          scrolled ? "bg-gradient-to-r from-[var(--daphne-purple)] via-[var(--scooby-gold)] to-[var(--daphne-purple)] backdrop-blur-sm" : "bg-[var(--daphne-purple)]"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              Elite <span className="text-[var(--scooby-gold)]">Dog Training</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-[var(--scooby-gold)] transition-colors">
                Home
              </Link>
              <Link href="/events" className="text-[var(--scooby-gold)]">
                Training Sessions
              </Link>
              <Link href="/contact" className="text-white hover:text-[var(--scooby-gold)] transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--daphne-purple)]/20 via-[var(--scooby-gold)]/10 to-transparent z-0"></div>
          <Image
            src="/rio.png"
            alt="Hero Background"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={75}
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
            className="opacity-40"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--velma-red)]/50 via-[var(--shaggy-maroon)]/40 to-transparent"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Training <span className="text-[var(--scooby-gold)]">Sessions</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mx-auto">
                Transform your dog's behavior with our expert-led training programs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Training Sessions Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Obedience */}
              <motion.div
                className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-[var(--scooby-gold)]/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-[var(--scooby-gold)] mb-4">Basic Obedience</div>
                <h3 className="text-xl font-semibold text-white mb-4">Master Essential Commands</h3>
                <p className="text-gray-300 mb-6">
                  Learn fundamental commands and build a strong foundation for your dog's training journey.
                </p>
                <button
                  onClick={() => setSelectedPost('obedience')}
                  className="text-[var(--scooby-gold)] hover:text-[var(--velma-orange)] transition-colors"
                >
                  Learn More →
                </button>
              </motion.div>

              {/* Agility Training */}
              <motion.div
                className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-[var(--scooby-gold)]/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-[var(--scooby-gold)] mb-4">Agility Training</div>
                <h3 className="text-xl font-semibold text-white mb-4">Navigate Obstacles</h3>
                <p className="text-gray-300 mb-6">
                  Develop coordination and confidence through exciting obstacle courses.
                </p>
                <button
                  onClick={() => setSelectedPost('agility')}
                  className="text-[var(--scooby-gold)] hover:text-[var(--velma-orange)] transition-colors"
                >
                  Learn More →
                </button>
              </motion.div>

              {/* Behavior Modification */}
              <motion.div
                className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-[var(--scooby-gold)]/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-[var(--scooby-gold)] mb-4">Behavior Modification</div>
                <h3 className="text-xl font-semibold text-white mb-4">Address Specific Issues</h3>
                <p className="text-gray-300 mb-6">
                  Tackle challenging behaviors with proven techniques and expert guidance.
                </p>
                <button
                  onClick={() => setSelectedPost('behavior')}
                  className="text-[var(--scooby-gold)] hover:text-[var(--velma-orange)] transition-colors"
                >
                  Learn More →
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-gradient-to-r from-[var(--velma-red)]/20 via-[var(--daphne-purple)]/20 to-[var(--velma-red)]/20">
        <div className="container mx-auto px-4 text-center text-gray-300">
          &copy; {new Date().getFullYear()} Elite Dog Training. All rights reserved.
        </div>
      </footer>

      {/* Blog Post Modal */}
      <BlogPostModal
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
        title={selectedPost ? blogPosts[selectedPost].title : ""}
        content={selectedPost ? blogPosts[selectedPost].content : []}
      />
    </div>
  );
} 