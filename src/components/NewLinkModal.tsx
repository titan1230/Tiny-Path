"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

interface CreateUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userID?: string;
}

export default function NewLinkModal({
  isOpen,
  onClose,
  onSuccess,
  userID
}: CreateUrlModalProps) {
  const [formData, setFormData] = useState({
    originalUrl: "",
    urlType: "temp" as "temp" | "permanent",
    expiresAt: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const body = {
        originalUrl: formData.originalUrl,
        urlType: formData.urlType,
        expiresAt: formData.expiresAt || null,
      };

      const response = await fetch(`/api/urls?userID=${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.error && data.error === "Rate limit exceeded") {
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      if (!response.ok) {
        throw new Error("Failed to create URL");
      }

      // Reset form
      setFormData({
        originalUrl: "",
        urlType: "temp",
        expiresAt: "",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        originalUrl: "",
        urlType: "temp",
        expiresAt: "",
      });
      setError("");
      onClose();
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-box w-11/12 max-w-2xl bg-white/95 sm:bg-white/10 backdrop-blur-xl border-0 sm:border sm:border-white/20 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <form method="dialog">
              <motion.button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 sm:text-white hover:bg-gray-200/50 sm:hover:bg-white/10 touch-manipulation"
                onClick={handleClose}
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3 }}
              >
                ✕
              </motion.button>
            </form>

            {/* Header */}
            <div className="mb-6">
              <motion.h3
                className="font-bold text-xl sm:text-2xl text-gray-800 sm:text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                ✨ Create Short URL
              </motion.h3>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Original URL Input */}
              <motion.div
                className="form-control w-full"
                custom={0}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="label">
                  <span className="label-text text-gray-700 sm:text-white/90 font-medium text-base">
                    🔗 Original URL
                  </span>
                </label>
                <motion.input
                  type="url"
                  placeholder="https://example.com"
                  className="input input-bordered input-lg sm:input-md bg-white sm:bg-white/10 border-gray-300 sm:border-white/20 text-gray-800 sm:text-white placeholder-gray-500 sm:placeholder-white/50 focus:border-purple-400 focus:bg-white sm:focus:bg-white/15 transition-all duration-300"
                  value={formData.originalUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, originalUrl: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              {/* URL Type Selection */}
              <motion.div
                className="form-control w-full"
                custom={1}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="label">
                  <span className="label-text text-gray-700 sm:text-white/90 font-medium text-base">
                    ⚡ URL Type
                  </span>
                </label>
                <div className="flex flex-col gap-3">
                  <motion.div
                    className="form-control"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <label className="label cursor-pointer justify-start gap-4 p-4 rounded-2xl bg-white sm:bg-white/5 border border-gray-200 sm:border-white/10 hover:bg-gray-50 sm:hover:bg-white/10 transition-all duration-300">
                      <input
                        type="radio"
                        name="urlType"
                        className="radio radio-primary radio-lg sm:radio-md"
                        value="temp"
                        checked={formData.urlType === "temp"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            urlType: e.target.value as "temp" | "permanent",
                          })
                        }
                        disabled={isLoading}
                      />
                      <div className="flex-1">
                        <span className="label-text text-gray-800 sm:text-white font-medium text-base">
                          Temporary
                        </span>
                        <p className="text-gray-600 sm:text-white/60 text-sm mt-1">
                          Expires automatically
                        </p>
                      </div>
                    </label>
                  </motion.div>

                  <motion.div
                    className="form-control"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <label className="label cursor-pointer justify-start gap-4 p-4 rounded-2xl bg-white sm:bg-white/5 border border-gray-200 sm:border-white/10 hover:bg-gray-50 sm:hover:bg-white/10 transition-all duration-300">
                      <input
                        type="radio"
                        name="urlType"
                        className="radio radio-primary radio-lg sm:radio-md"
                        value="permanent"
                        checked={formData.urlType === "permanent"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            urlType: e.target.value as "temp" | "permanent",
                          })
                        }
                        disabled={isLoading}
                      />
                      <div className="flex-1">
                        <span className="label-text text-gray-800 sm:text-white font-medium text-base">
                          Permanent
                        </span>
                        <p className="text-gray-600 sm:text-white/60 text-sm mt-1">
                          Never expires
                        </p>
                      </div>
                    </label>
                  </motion.div>
                </div>
              </motion.div>

              {/* Expiration Date (only for temp URLs) */}
              <AnimatePresence>
                {formData.urlType === "temp" && (
                  <motion.div
                    className="form-control w-full"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="label">
                      <span className="label-text text-gray-700 sm:text-white/90 font-medium text-base">
                        ⏰ Expires At (Optional)
                      </span>
                    </label>
                    <motion.input
                      type="datetime-local"
                      className="input input-bordered input-lg sm:input-md bg-white sm:bg-white/10 border-gray-300 sm:border-white/20 text-gray-800 sm:text-white focus:border-purple-400 focus:bg-white sm:focus:bg-white/15 transition-all duration-300"
                      value={formData.expiresAt}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expiresAt: e.target.value,
                        })
                      }
                      disabled={isLoading}
                      min={new Date().toISOString().slice(0, 16)}
                      whileFocus={{ scale: 1.01 }}
                    />
                    <label className="label">
                      <span className="label-text-alt text-gray-500 sm:text-white/60">
                        Leave empty for no expiration
                      </span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="alert alert-error bg-red-100 sm:bg-red-500/20 border-red-300 sm:border-red-500/30 text-red-700 sm:text-red-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <motion.div
                className="modal-action"
                custom={3}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  type="button"
                  className="btn btn-ghost btn-lg sm:btn-md text-gray-600 sm:text-white border-gray-300 sm:border-white/20 hover:bg-gray-100 sm:hover:bg-white/10 touch-manipulation"
                  onClick={handleClose}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="btn btn-primary btn-lg sm:btn-md bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white hover:from-purple-600 hover:to-pink-600 shadow-lg touch-manipulation"
                  disabled={isLoading || !formData.originalUrl}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading && (
                    <span className="loading loading-spinner loading-md sm:loading-sm"></span>
                  )}
                  ✨ Create Short URL
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DaisyUI Modal Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose} disabled={isLoading}>
          close
        </button>
      </form>
    </div>
  );
}
