// import React from 'react'

// function Playlist() {
//   return (
//     <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4  ">
//      <div className="mb-4 col-span-full xl:mb-2"> 
//        {/*-------------------content---------------------  */}
//         <div className=' text-4xl font-black text-gray-900'>Playlist</div>
//         {/* <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  " role="alert">
//   <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//     <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
//   </svg>
//   <span class="sr-only">Info</span>
//   <div>
//     <span class="font-medium">Login alert!</span> Please login your account and try again.
//   </div>
// </div> */}
//        {/*-------------------content---------------------  */}
//     </div>
//     </div>
//   )
// }

// export default Playlist


import React from "react";

function Playlist() {
  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        {/* Heading */}
        <div className="text-4xl font-black text-gray-900">Playlist</div>

        {/* In Progress Alert */}
        <div
          className="flex items-center p-4 mt-6 text-sm text-blue-800 rounded-lg bg-blue-50"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-5 h-5 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4H9V6h2v4Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">In Progress!</span> Playlist feature is
            currently under development. 🚀
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
