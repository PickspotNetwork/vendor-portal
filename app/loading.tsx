import React from "react";

export default function Loading() {
  return (
    <section className="flex items-center justify-center h-screen">
      <div
        className="w-16 h-16 rounded-full animate-spin
        border-x-4 border-solid border-primary border-t-transparent"
      ></div>
    </section>
  );
}
