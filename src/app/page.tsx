"use client";

import { useState, useEffect, useRef, ReactNode, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import Loading from "@/components/Loading";

// Simple static logo component instead of animated version
function Logo() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-4xl">🐕</span>
        <span className="text-3xl font-bold text-[var(--scooby-teal)]">Mystery Inc.</span>
      </div>
      <h2 className="text-xl text-[var(--mystery-white)] font-medium">Dog Training</h2>
    </div>
  );
}

// Simplified static text component to reduce animation overhead
function AnimatedText() {
  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      <h1 className="text-center text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--velma-orange)] via-[var(--daphne-purple)] to-[var(--scooby-gold)] tracking-tight px-4">
        SOLVE THE MYSTERY OF DOG TRAINING
      </h1>
    </div>
  );
}

// Scroll-triggered animation section - optimized for performance with reduced scroll impact
function AnimatedSection({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.1 // Reduce the visible amount needed to trigger
  });
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
      className={className}
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 15 }, // Reduced distance to improve performance
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ 
        duration: 0.4, // Faster animations
        delay, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const conversionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Only redirect on initial sign in
  useEffect(() => {
    if (isLoaded && isSignedIn && window.location.pathname === '/') {
      const hasVisitedHome = sessionStorage.getItem('hasVisitedHome');
      if (!hasVisitedHome) {
        sessionStorage.setItem('hasVisitedHome', 'true');
        setIsLoading(true);
        router.push("/events");
      }
    }
  }, [isSignedIn, isLoaded, router]);

  // For navigation to events page
  const navigateToEvents = useCallback(() => {
    setIsLoading(true);
    router.push("/events");
  }, [router]);

  // Update scroll effect with useCallback, passive event listener and throttling
  useEffect(() => {
    let isScrolling = false;
    
    const throttledScrollHandler = () => {
      if (!isScrolling) {
        isScrolling = true;
        
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          // Show back to top button when near bottom of page
          setShowBackToTop(scrollPosition + windowHeight > documentHeight - 100);
          setScrolled(scrollPosition > 100);
          isScrolling = false;
        });
      }
    };
    
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, []);

  // Use useCallback for toggle function
  const toggleMobileMenu = useCallback(() => 
    setMobileMenuOpen(prev => !prev), []);
    
  // Use useCallback for scroll function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Only modify history if we're not on the home page
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', window.location.pathname);
    }
  }, []);

  // Add smooth scroll function
  const scrollToConversion = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    conversionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <div className="bg-black overflow-auto">
        {/* Navbar */}
        <motion.header
          className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ${
            scrolled ? "bg-gradient-to-r from-[var(--daphne-purple)] via-[var(--scooby-gold)] to-[var(--daphne-purple)] backdrop-blur-sm" : "bg-[var(--daphne-purple)]"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Left Side: Show UserButton if signed in, otherwise show Logo */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={scrollToTop}
            >
              {isSignedIn ? <UserButton /> : <Image src="/rio.png" alt="Logo" width={50} height={50} className="rounded-full" />}
              <span className="text-2xl font-bold text-white">
                Elite <span className="text-[var(--scooby-gold)]">Dog Training</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav 
              className="hidden md:flex space-x-6 text-lg items-center text-[var(--mystery-white)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {["Services", "Testimonials"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-[var(--scooby-gold)] relative group font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  {item}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--scooby-gold)] group-hover:w-full transition-all duration-300"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                  />
                </motion.a>
              ))}
              
              {isSignedIn ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <button 
                    onClick={navigateToEvents}
                    className="hover:text-[var(--scooby-gold)] relative group font-medium"
                  >
                    Training Sessions
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--scooby-gold)] group-hover:w-full transition-all duration-300"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                    />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <SignInButton>
                    <button className="hover:text-[var(--scooby-gold)] relative group font-medium">
                      Book a Session
                      <motion.span 
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--scooby-gold)] group-hover:w-full transition-all duration-300"
                        initial={{ width: "0%" }}
                        whileHover={{ width: "100%" }}
                      />
                    </button>
                  </SignInButton>
                </motion.div>
              )}
            </motion.nav>

            {/* Mobile Hamburger */}
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button onClick={toggleMobileMenu} className="focus:outline-none text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </motion.div>
          </div>
        </motion.header>

        {/* Fullscreen Mobile Menu with Smooth Transition */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Close Button */}
              <motion.button 
                onClick={toggleMobileMenu} 
                className="absolute top-5 right-5 text-3xl text-white"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.button>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-6 text-3xl">
                <motion.button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                  className="hover:text-red-500 transition-all duration-300 text-3xl font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 0.4 }}
                  whileHover={{ scale: 1.1, x: 10 }}
                >
                  Home
                </motion.button>
                
                {["Services", "Testimonials"].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-red-500 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.1, x: 10 }}
                  >
                    {item}
                  </motion.a>
                ))}
                
                {isSignedIn ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigateToEvents();
                      }}
                      className="hover:text-red-500 transition-all duration-300"
                    >
                      Events
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <SignInButton>
                      <button 
                        className="hover:text-red-500 transition-all duration-300" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Bookings
                      </button>
                    </SignInButton>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section: Fullscreen background with animated text and particles */}
        <section id="hero" ref={heroRef} className="relative h-screen flex flex-col items-center justify-between py-24 overflow-hidden">
          {/* Background elements with vibrant theme */}
          <div className="absolute inset-0 bg-gradient-radial from-[var(--daphne-purple)]/20 via-[var(--fred-orange)]/10 to-transparent z-0"></div>
          
          <Image
            src="/rio.png"
            alt="Hero Background"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={75}
            style={{ objectFit: "cover", objectPosition: "center 10%" }}
            className="opacity-60"
            loading="eager"
            fetchPriority="high"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--velma-red)]/40 via-[var(--shaggy-maroon)]/30 to-transparent"></div>

          {/* Content restructured for better positioning */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full w-full px-4 max-w-5xl mx-auto">
            {/* Empty space at top to push content to center */}
            <div className="flex-grow"></div>
            
            {/* Main content section */}
            <div className="flex flex-col items-center mb-16 w-full">
              <div className="mb-8 w-full">
                <AnimatedText />
              </div>
              
              <p className="text-xl md:text-2xl text-[var(--mystery-white)] mb-12 max-w-3xl text-center font-medium">
                Transform your pup into a well-behaved companion through expert training and proven techniques.
              </p>

              <div
                className="hover:scale-105 transition-transform duration-300"
              >
                {isSignedIn ? (
                  <Link 
                    href="/contact"
                    className="bg-[var(--velma-orange)] hover:bg-[var(--fred-orange)] text-[var(--mystery-white)] text-lg md:text-2xl px-8 md:px-10 py-6 md:py-7 rounded-xl shadow-[0_0_15px_rgba(255,127,80,0.5)] font-bold transition-all duration-300 ease-in-out w-full md:w-auto"
                  >
                    <span className="relative">
                      Schedule Training
                    </span>
                  </Link>
                ) : (
                  <SignInButton>
                    <button className="bg-[var(--velma-orange)] hover:bg-[var(--fred-orange)] text-[var(--mystery-white)] text-lg md:text-2xl px-8 md:px-10 py-6 md:py-7 rounded-xl shadow-[0_0_15px_rgba(255,127,80,0.5)] font-bold transition-all duration-300 ease-in-out w-full md:w-auto">
                      <span className="relative">
                        Book a Session
                      </span>
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
          
          {/* Scroll indicator at the very bottom */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <a
              href="#conversion"
              onClick={scrollToConversion}
              className="text-[var(--mystery-white)] flex flex-col items-center animate-bounce"
            >
              <span className="mb-2 text-sm uppercase tracking-widest">Discover More</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </section>

        {/* Conversion Section */}
        <section ref={conversionRef} id="conversion" className="py-20 bg-gradient-to-b from-[var(--daphne-purple)]/10 to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Transform Your Dog's <span className="text-[var(--scooby-gold)]">Behavior</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Like Scooby and the gang solving mysteries, we'll help you uncover the secrets to your dog's perfect behavior! Our expert trainers use proven techniques that turn even the most challenging behaviors into obedient companions.
                </p>
                <p className="text-lg text-gray-400 mb-8">
                  Through our personalized training system, you'll learn how to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-[var(--scooby-gold)]/20">
                    <p className="text-[var(--scooby-gold)] font-semibold mb-2">🐕 Master Basic Commands</p>
                    <p className="text-gray-300">From "sit" to "stay", build a solid foundation of obedience.</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-[var(--scooby-gold)]/20">
                    <p className="text-[var(--scooby-gold)] font-semibold mb-2">🎯 Solve Behavior Issues</p>
                    <p className="text-gray-300">Address specific challenges with proven techniques.</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-[var(--scooby-gold)]/20">
                    <p className="text-[var(--scooby-gold)] font-semibold mb-2">🤝 Strengthen Your Bond</p>
                    <p className="text-gray-300">Build trust and understanding through positive training.</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-[var(--scooby-gold)]/20">
                    <p className="text-[var(--scooby-gold)] font-semibold mb-2">🌟 Boost Confidence</p>
                    <p className="text-gray-300">Help your dog become more confident and well-adjusted.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section with animations */}
        <section id="services" className="py-28 bg-gradient-to-b from-[var(--velma-red)]/10 to-black relative overflow-hidden">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-4xl md:text-6xl font-bold relative inline-block text-white">
                    Our <span className="text-[var(--scooby-gold)]">Services</span>
                    <motion.div 
                      className="absolute -bottom-3 left-0 h-1 bg-[var(--scooby-gold)]/30"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </h2>
                </motion.div>
                <p className="text-gray-300 text-xl mt-6">
                  From puppy training to advanced agility, we offer specialized programs for every stage of your dog's journey.
                </p>
              </div>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Puppy Training */}
              <AnimatedSection delay={0.2}>
                <motion.div 
                  className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl h-full group cursor-pointer border border-[var(--scooby-gold)]/20"
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 10px 30px -5px rgba(255, 127, 80, 0.5)"
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    "--glow-color": "rgba(255, 127, 80, 0.7)",
                    "--glow-color-light": "rgba(255, 127, 80, 0.4)"
                  } as React.CSSProperties}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-[var(--velma-orange)]/20"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-8 h-8 bg-[var(--velma-orange)] rounded-lg"></div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4">
                    <span className="inline-block transition-all duration-300 group-hover:text-[var(--velma-orange)] first-word">
                      Puppy
                    </span>{" "}
                    <span className="text-[var(--velma-orange)]">
                      Training
                    </span>
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Start your puppy's journey right with socialization, potty training, and basic manners.
                  </p>
                </motion.div>
              </AnimatedSection>

              {/* Agility Training */}
              <AnimatedSection delay={0.4}>
                <motion.div 
                  className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl h-full group cursor-pointer border border-[var(--scooby-gold)]/20"
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 10px 30px -5px rgba(147, 112, 219, 0.5)"
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    "--glow-color": "rgba(147, 112, 219, 0.7)",
                    "--glow-color-light": "rgba(147, 112, 219, 0.4)"
                  } as React.CSSProperties}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-[var(--daphne-purple)]/20"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-8 h-8 bg-[var(--daphne-purple)] rounded-lg"></div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4">
                    <span className="inline-block transition-all duration-300 group-hover:text-[var(--daphne-purple)] first-word">
                      Agility
                    </span>{" "}
                    <span className="text-[var(--daphne-purple)]">
                      Training
                    </span>
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Master obstacle courses and advanced agility skills for competition or fun.
                  </p>
                </motion.div>
              </AnimatedSection>

              {/* Therapy Dog Training */}
              <AnimatedSection delay={0.6}>
                <motion.div 
                  className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl h-full group cursor-pointer border border-[var(--scooby-gold)]/20"
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 10px 30px -5px rgba(255, 215, 0, 0.5)"
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    "--glow-color": "rgba(255, 215, 0, 0.7)",
                    "--glow-color-light": "rgba(255, 215, 0, 0.4)"
                  } as React.CSSProperties}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-[var(--scooby-gold)]/20"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-8 h-8 bg-[var(--scooby-gold)] rounded-lg"></div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4">
                    <span className="inline-block transition-all duration-300 group-hover:text-[var(--scooby-gold)] first-word">
                      Therapy
                    </span>{" "}
                    <span className="text-[var(--scooby-gold)]">
                      Dog Training
                    </span>
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Prepare your dog to bring comfort and joy to those in need through therapy work.
                  </p>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Professional Design */}
        <section id="testimonials" className="py-28 relative overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--daphne-purple)]/10 to-black/90 z-0"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--scooby-gold)]/20 to-transparent"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="flex flex-col items-center mb-16">
                <div className="inline-block mb-3">
                  <div className="w-10 h-1 bg-[var(--scooby-gold)] mx-auto"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Client <span className="text-[var(--scooby-gold)]">Testimonials</span>
                </h2>
                <p className="text-gray-300 text-lg mt-4 max-w-2xl text-center">
                  Discover what our clients have to say about their transformative experiences with our premium training services.
                </p>
              </div>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedSection delay={0.1}>
                <motion.div 
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 relative overflow-hidden border border-[var(--scooby-gold)]/20 shadow-xl"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 -m-16 opacity-10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[var(--scooby-gold)]">
                      <path d="M9 7.5l-4.5 4.5h3l-6 9h7.5l6-9h-3l4.5-4.5h-7.5z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  <div className="text-xl text-gray-200 font-light italic leading-relaxed mb-8">
                    "<span className="text-white font-medium">The personalized approach</span> at <span className="text-[var(--scooby-gold)]">Elite Dog Training</span> helped me transform my dog's behavior. The attention to detail in their training programs is unmatched in the industry."
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--scooby-gold)]/20 flex-shrink-0">
                      <Image
                        src="/rio.png"
                        alt="Client 1"
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-white text-lg">John Doe</p>
                      <div className="flex items-center">
                        <p className="text-gray-400 text-sm">Dog Owner • Labrador</p>
                        <div className="flex ml-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-3 h-3 text-[var(--scooby-gold)]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
              
              <AnimatedSection delay={0.3}>
                <motion.div 
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 relative overflow-hidden border border-[var(--scooby-gold)]/20 shadow-xl"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 -m-16 opacity-10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[var(--scooby-gold)]">
                      <path d="M9 7.5l-4.5 4.5h3l-6 9h7.5l6-9h-3l4.5-4.5h-7.5z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  <div className="text-xl text-gray-200 font-light italic leading-relaxed mb-8">
                    "Their training transformed <span className="text-white font-medium">not just my dog's behavior, but our relationship</span>. I now have a well-behaved companion who listens and responds. The level of expertise and dedication from their team is exceptional."
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--scooby-gold)]/20 flex-shrink-0">
                      <Image
                        src="/rio.png"
                        alt="Client 2"
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-white text-lg">Jane Smith</p>
                      <div className="flex items-center">
                        <p className="text-gray-400 text-sm">Dog Owner • German Shepherd</p>
                        <div className="flex ml-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-3 h-3 text-[var(--scooby-gold)]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07 3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              About <span className="text-[var(--scooby-gold)]">Us</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg">
              At <span className="font-semibold text-[var(--scooby-gold)]">Elite Dog Training</span>, we blend expert training techniques with a passion for dogs.
              Our mission is to help you build a strong bond with your furry friend through effective training.
              Experience a revolutionary approach to dog training that delivers real, measurable results.
            </p>
          </div>
        </section>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 -ml-24 z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={scrollToTop}
                className="bg-gradient-to-r from-[var(--velma-orange)]/80 to-[var(--fred-orange)]/80 backdrop-blur-sm text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group hover:from-[var(--velma-orange)] hover:to-[var(--fred-orange)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg font-semibold">Back to Top</span>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ 
                    y: [0, -5, 0],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 10l7-7m0 0l7 7m-7-7v18" 
                  />
                </motion.svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="py-8 bg-gradient-to-r from-[var(--velma-red)]/20 via-[var(--daphne-purple)]/20 to-[var(--velma-red)]/20">
          <div className="container mx-auto px-4 text-center text-gray-300">
            &copy; {new Date().getFullYear()} Elite Dog Training. All rights reserved.
          </div>
        </footer>
              
      </div>
    </>
  );
}