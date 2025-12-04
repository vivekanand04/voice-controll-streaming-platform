

import React from "react";

function Shorts() {
  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        {/* Heading */}
        <div className="mb-7 text-3xl font-black text-gray-900">Shorts</div>

        {/* In Progress Alert */}
        <div
          className="flex items-center p-4 text-sm text-orange-800 rounded-lg bg-orange-50"
          role="alert"
        >
          <svg
            className="flex-shrink-0 w-5 h-5 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">In Progress!</span> Shorts feature is
            currently under development. ⚡
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shorts;
