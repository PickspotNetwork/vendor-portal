"use client";

import { motion } from "framer-motion";
import { Ban, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export function SuspensionScreen() {
  const { logout } = useUser();

  return (
    <div className="lg:min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center lg:p-4 rounded-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-red-500/30 rounded-3xl p-4 lg:p-12 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-500/50"
            >
              <Ban className="w-12 h-12 text-red-400" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
            >
              You have been{" "}
              <span className="text-red-400 relative">
                SQUASHED
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-red-400 rounded"
                />
              </span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-2 lg:p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="text-white leading-relaxed">
                <p className="mb-4">
                  Our system has detected violations of the campaign rules, specifically the use of{" "}
                  <span className="font-semibold text-red-300">non-existent phone numbers</span>,{" "}
                  <span className="font-semibold text-red-300">duplicate registrations</span>, or other forms of abuse in creating digital addresses.
                </p>
                <p className="mb-4">
                  Participation in this campaign is strictly limited to genuine, verified users. Any attempt to exploit the system undermines the fairness of the process and will result in immediate suspension.
                </p>
                <p className="font-semibold text-red-300">
                  Your participation privileges have therefore been revoked. This action is final and applies to all accounts found in breach of the rules.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-8 text-gray-300"
          >
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Protected by Pickspot Security</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={logout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Return to Login
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-center mt-8 text-gray-400 text-sm"
          >
            <p>Piece of shit.</p>
          </motion.div>
        </div>

        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-4 h-4 bg-red-500/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-20 w-6 h-6 bg-red-400/20 rounded-full blur-sm"
        />
      </motion.div>
    </div>
  );
}