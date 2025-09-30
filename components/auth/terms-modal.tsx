"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  Users,
  Database,
  CreditCard,
  AlertTriangle,
  FileText,
  Calendar,
} from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const terms = [
    {
      icon: Users,
      title: "Eligibility",
      content:
        "Access to the Portal is limited to approved vendors and partners authorized to redeem digital addresses. Unauthorized use is prohibited.",
      color: "#D62E1F",
    },
    {
      icon: Shield,
      title: "Use of the Portal",
      content:
        "The Portal may only be used to process, validate, and redeem digital addresses in accordance with PickSpot's policies. Any attempt to create false claims, duplicate entries, or otherwise misuse the system will result in suspension or termination.",
      color: "#D62E1F",
    },
    {
      icon: Database,
      title: "Data & Privacy",
      content:
        "Vendors are responsible for the accuracy of all information submitted during redemption. PickSpot may collect and process this data for verification, fraud prevention, and service delivery in compliance with applicable laws.",
      color: "#D62E1F",
    },
    {
      icon: CreditCard,
      title: "Payments & Settlements",
      content:
        "Where applicable, redemptions may result in payments, credits, or rewards as outlined in the vendor agreement. PickSpot reserves the right to withhold or deny settlements in cases of suspected fraud, policy violations, or breach of these terms.",
      color: "#D62E1F",
    },
    {
      icon: AlertTriangle,
      title: "Suspension & Termination",
      content:
        "PickSpot may suspend or terminate access at any time if fraudulent or abusive activity is detected, or if the vendor violates these terms.",
      color: "#D62E1F",
    },
    {
      icon: FileText,
      title: "Limitation of Liability",
      content:
        'The Portal is provided "as is." PickSpot is not liable for any indirect or consequential losses arising from its use.',
      color: "#D62E1F",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#D62E1F] to-[#B22E1F] p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Vendor Portal – Terms of Service
                  </h2>
                  <div className="flex items-center gap-2 text-red-100">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Effective Date: August 26, 2025
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-white/5 rounded-full"></div>
            </div>

            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 mb-8 text-center bg-gray-50 p-4 rounded-lg border-l-2 border-r-2 border-[#D62E1F]"
              >
                By registering and using the PickSpot Vendor Portal
                (&quot;Portal&quot;), you agree to the following terms:
              </motion.p>

              <div className="grid gap-6">
                {terms.map((term, index) => {
                  const IconComponent = term.icon;
                  return (
                    <motion.div
                      key={term.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl bg-[${term.color}] text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#D62E1F] transition-colors">
                            {term.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {term.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mt-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#D62E1F] text-white shadow-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Changes to Terms
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        PickSpot may update these Terms of Service at any time.
                        Continued use of the Portal constitutes acceptance of
                        the updated terms.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  © 2025 PickSpot. All rights reserved.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[#D62E1F] text-white rounded-lg hover:bg-[#B22E1F] transition-colors font-medium"
                >
                  I Understand
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
