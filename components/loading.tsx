import { LoaderCircle, LoaderPinwheel } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <LoaderCircle className="w-14 h-14 text-white animate-[spin_1s_linear_infinite]" />
    </div>
  );
};

export default Loading;
