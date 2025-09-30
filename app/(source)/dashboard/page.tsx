"use client";

import { useAuth } from "@/hooks/useAuth";
import { Notification } from "@/components/ui/notification";
import RedemptionForm from "@/components/redemption-form";
import RecentRedemptions from "@/components/recent-redemptions";
// import Image from "next/image";

export default function Dashboard() {
  const { error, success, clearMessages } = useAuth();

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Digital Handle Redemption
            </h2>
            <p className="text-gray-600">
              Redeem Pickspot app users by entering their digital handle
            </p>
            {/* <p className="text-gray-600 mb-2">
              We&apos;re taking out the trash and making things better!
            </p>
            <div className="flex flex-col items-center justify-center pt-8">
              <Image
                src="/images/throw.svg"
                alt="Under Maintenance"
                width={196}
                height={196}
                className="mb-4"
              />
              <p className="text-gray-500 max-w-md">
                We&apos;re currently performing some maintenance to improve your
                experience. The redemption form will be back soon, better than
                ever!
              </p>
            </div> */}
          </div>

          <RedemptionForm />
        </div>

        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <RecentRedemptions />
        </div>
      </div>

      {error && (
        <Notification type="error" message={error} onClose={clearMessages} />
      )}
      {success && (
        <Notification
          type="success"
          message={success}
          onClose={clearMessages}
        />
      )}
    </>
  );
}
