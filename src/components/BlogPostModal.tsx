"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string[];
}

export default function BlogPostModal({ isOpen, onClose, title, content }: BlogPostModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--scooby-gold)]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[var(--scooby-gold)] transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-3xl font-bold mb-6 text-white">
              {title}
            </h2>
            
            <div className="space-y-6">
              {content.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-300 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 