"use client";

import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ContactPageClient() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
              <Link href="/events" className="text-white hover:text-[var(--scooby-gold)] transition-colors">
                Training Sessions
              </Link>
              <Link href="/contact" className="text-[var(--scooby-gold)]">
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
                Contact <span className="text-[var(--scooby-gold)]">Us</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mx-auto">
                Get in touch to start your dog's training journey today.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Left side info panel */}
                <div className="md:col-span-2">
                  <motion.div 
                    className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-[var(--scooby-gold)]/20 h-full"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                          <span className="mr-3 text-[var(--scooby-gold)]">🐕</span>
                          Why Choose Us
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          Our elite dog training team brings over 20 years of experience with a personalized approach that guarantees results.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                          <span className="mr-3 text-[var(--scooby-gold)]">📞</span>
                          Get in Touch
                        </h3>
                        <div className="space-y-3 pl-9">
                          <p className="text-white">contact@elitedogtraining.com</p>
                          <p className="text-white">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                          <span className="mr-3 text-[var(--scooby-gold)]">⏱️</span>
                          Response Time
                        </h3>
                        <div className="flex items-center gap-2 pl-9">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-[var(--velma-orange)] to-[var(--fred-orange)] h-2 rounded-full"
                              initial={{ width: "0%" }}
                              whileInView={{ width: "90%" }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </div>
                          <span className="text-white font-medium">24h</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Right side form */}
                <div className="md:col-span-3">
                  <motion.div 
                    className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-[var(--scooby-gold)]/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <ContactForm />
                  </motion.div>
                </div>
              </div>
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
    </div>
  );
} 