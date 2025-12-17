import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function NumberInput({ onChange, value }) {
  const increment = () => {
    onChange((prev) => prev + 1);
  };

  const decrement = () => {
    onChange((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
      <button
        onClick={decrement}
        disabled={value <= 0}
        className="h-10 w-10 flex items-center justify-center bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-r border-gray-300"
      >
        <Minus className="h-4 w-4" strokeWidth={2} />
      </button>

      <div className="h-10 w-12 flex items-center justify-center bg-white text-gray-900 font-medium">
        {value}
      </div>

      <button
        onClick={increment}
        className="h-10 w-10 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors border-l border-blue-500"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
