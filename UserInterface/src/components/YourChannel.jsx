// import { useState , useEffect } from "react";
// import React  from 'react'
// import { Link , Outlet } from "react-router-dom";
// import { useSelector } from 'react-redux';
// import axios from "axios";

// function YourChannel() {

  
//   const  data = useSelector((state) => state.auth.user);
//   // console.log(data._id);

//   const [userdata , setUserData]  = useState();
  
//   useEffect(() => {
    
//           const fetchUser = async () => {
//               try {
//                   const response = await axios.get(`/api/v1/account/userData/${data._id}`);
//                   console.log("the YourChannel",response)
//                   setUserData(response.data.data);
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                   }
//                 };
            
//                 fetchUser();
              
//     }, [data]);
            
//     // console.log(userdata);

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long' };
//     const date = new Date(dateString);
//     return date.toLocaleDateString(undefined, options);
//   };

  
//   // console.log(formatDate);

  

//   return (
//     <>
//     <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4  ">
//      <div className="mb-4 col-span-full xl:mb-2"> 
//        {/*-------------------content---------------------  */}
//         {/* <div className='mb-4' >YourChannel</div> */}
//         {/* <hr /> */}
//         <div class="mt-4 flex items-center gap-5">
           
//             {userdata ? (

//             <>
//               <img class="w-28 h-28 rounded-full" src={userdata.avatar} alt="not found"/>
//               <div class="font-bold dark:text-black">
//                 <div className='text-lg' >{(userdata.name || "Admin").toUpperCase()}</div>
//                 <div class="text-sm mb-3 text-gray-500  ">Joined in {formatDate(userdata.createdAt)}</div>
//                 <Link to={"/customize_channel"}>
//                 <button type="button" className=" text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-2.5 py-2.5 me-2 ">Customize channel</button>
//                 </Link>
//             </div>
//             </>
              
//             ) : (
//               <div>Loading user data...</div>
//             )}
            
//         </div>
//         {/* --------------------------------tab-------------------------------- */}
        

//         <div className="border-b border-gray-200">
//           <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
//             <li className="me-2">
//               <Link
//                 to={""}
//                 className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
//               >
//                 <svg
//                   className="w-4 h-4 me-2 "
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 18 18"
//                 >
//                   <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
//                 </svg>
//                  All Videos
//               </Link>
//             </li>
//             <li className="me-2">
//               <Link
//                 to={"upload_video"}
//                 className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
//               >
//                 <svg
//                   className="w-4 h-4 me-2 "
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
//                 </svg>
//                 Upload Video
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* --------------------------------tab-------------------------------- */}
//         {/* <hr className='mt-4' /> */}

//         <Outlet/>


        
      
//        {/*-------------------content---------------------  */}
//     </div>
//     </div>
//     </>
//   )
// }

// export default YourChannel




// import React, { useState, useEffect } from "react";
// import { Link, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";

// function YourChannel() {
//   const data = useSelector((state) => state.auth.user);

//   const [userdata, setUserData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchError, setFetchError] = useState(null);

//   // Development fallback — remove or change in production
//   const FALLBACK_ID = "68c0014613d132a0b12ca4fa";
//   const API_BASE = "http://localhost:5000";

//   useEffect(() => {
//     // If you want to always test a hard-coded id in dev, don't early-return.
//     // If you want to fetch only when redux user exists, restore the guard.
//     const idToFetch = data?._id;
//     // const idToFetch = data?._id ?? data?.id ?? data?.userId;
//     if (!idToFetch) {
//       console.debug("No id available to fetch");
//       return;
//     }

//     const controller = new AbortController();
//     const fetchUser = async () => {
//       setLoading(true);
//       setFetchError(null);
//       try {
//         const url = `${API_BASE}/api/v1/account/userData/${idToFetch}`;
//         const headers = { "Content-Type": "application/json" };
//         const hasToken = Boolean(data?.token);
//         if (hasToken) {
//           headers.Authorization = `Bearer ${data.token}`;
//           console.debug("Sending Authorization bearer token");
//         } else {
//           console.debug("No token present; request will include cookies if server expects it (withCredentials true)");
//         }

//         const response = await axios.get(url, {
//           headers,
//           withCredentials: !hasToken, // include cookies only if no token
//           signal: controller.signal,
//         });

//         console.debug("Axios response status", response.status);
//         console.debug("Axios response.data:", response.data);

//         // adjust depending on your backend
//         const userObj = response?.data?.data ?? response?.data ?? null;

//         if (!userObj) {
//           setFetchError("Server returned no user object — check response shape in network/Postman.");
//           setUserData(null);
//           console.warn("Unexpected response shape:", response.data);
//         } else {
//           setUserData(userObj);
//         }
//       } catch (err) {
//         if (err.name === "CanceledError" || err.message === "canceled") {
//           console.log("Request aborted");
//         } else {
//           console.error("Fetch error:", err);
//           if (err.response) {
//             setFetchError(`Server ${err.response.status}: ${JSON.stringify(err.response.data)}`);
//           } else if (err.request) {
//             setFetchError("No response received — network/CORS/server down.");
//           } else {
//             setFetchError(err.message);
//           }
//           setUserData(null);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();

//     return () => {
//       controller.abort();
//     };
//     // If you want to re-run when token or id changes:
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data?._id, data?.token]);


  
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const options = { year: "numeric", month: "long" };
//     const date = new Date(dateString);
//     return date.toLocaleDateString(undefined, options);
//   };

//   return (
//     <>
//       <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
//         <div className="mb-4 col-span-full xl:mb-2">
//           <div className="mt-4 flex items-center gap-5">
//             {loading ? (
//               <div>Loading user data...</div>
//             ) : fetchError ? (
//               <div className="text-sm text-red-600">Error: {fetchError}</div>
//             ) : userdata ? (
//               <>
//                 <img
//                   className="w-28 h-28 rounded-full object-cover"
//                   src={userdata.avatar || "/fallback-avatar.png"}
//                   alt={userdata.name || "avatar"}
//                   onError={(e) => {
//                     e.currentTarget.onerror = null;
//                     e.currentTarget.src = "/fallback-avatar.png";
//                   }}
//                 />
//                 <div className="font-bold text-black">
//                   <div className="text-lg">{(userdata.name || "Admin").toUpperCase()}</div>
//                   <div className="text-sm mb-3 text-gray-500">
//                     Joined in {formatDate(userdata.createdAt)}
//                   </div>
//                   <Link to={"/customize_channel"}>
//                     <button
//                       type="button"
//                       className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-2.5 py-2.5 me-2"
//                     >
//                       Customize channel
//                     </button>
//                   </Link>
//                 </div>
//               </>
//             ) : (
//               <div>No user data yet.</div>
//             )}
//           </div>

//           {/* tabs */}
//           <div className="border-b border-gray-200 mt-6">
//             <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
//               <li className="me-2">
//                 <Link to={""} className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300">
//                   All Videos
//                 </Link>
//               </li>
//               <li className="me-2">
//                 <Link to={"upload_video"} className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300">
//                   Upload Video
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// }

// export default YourChannel;



// YourChannel.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function YourChannel() {
  // <- select user and tokens from redux (auth slice)
  const { user, accessToken } = useSelector((state) => state.auth);

  const [userdata, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const API_BASE = "http://localhost:5000";





useEffect(() => {
  const idToFetch = user?._id ?? user?.id;
  if (!idToFetch) {
    console.warn("No id available yet — will wait for redux to populate user");
    return;
  }

  const controller = new AbortController();
  const fetchUser = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/api/v1/account/userData/${idToFetch}`;
      const headers = { "Content-Type": "application/json" };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const response = await axios.get(url, {
        headers,
        withCredentials: !Boolean(accessToken),
        signal: controller.signal,
      });
      const userObj = response?.data?.data ?? response?.data ?? null;
      setUserData(userObj);
    } catch (err) {
      if (err.name === "CanceledError" || err.message === "canceled") {
        console.log("Request aborted");
      } else {
        console.error("Fetch error:", err);
        setFetchError(err.response ? `Server ${err.response.status}` : "Network/other error");
        setUserData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
  return () => controller.abort();
}, [user?._id, user?.id, accessToken]);



  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="mt-4 flex items-center gap-5">
            {loading ? (
              <div>Loading user data...</div>
            ) : fetchError ? (
              <div className="text-sm text-red-600">Error: {fetchError}</div>
            ) : userdata ? (
              <>
                <img
                  className="w-28 h-28 rounded-full object-cover"
                  src={userdata.avatar || "/fallback-avatar.png"}
                  alt={userdata.name || "avatar"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/fallback-avatar.png";
                  }}
                />
                <div className="font-bold text-black">
                  <div className="text-lg">{(userdata.name || "Admin").toUpperCase()}</div>
                  <div className="text-sm mb-3 text-gray-500">
                    Joined in {formatDate(userdata.createdAt)}
                  </div>
                  <Link to={"/customize_channel"}>
                    <button
                      type="button"
                      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-2.5 py-2.5 me-2"
                    >
                      Customize channel
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <div>No user data yet.</div>
            )}
          </div>

          {/* tabs */}
          <div className="border-b border-gray-200 mt-6">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
              <li className="me-2">
                <Link
                  to={""}
                  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
                >
                  All Videos
                </Link>
              </li>
              <li className="me-2">
                <Link
                  to={"upload_video"}
                  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
                >
                  Upload Video
                </Link>
              </li>
            </ul>
          </div>

          <Outlet />
        </div>
      </div>
    </>
  );
}

export default YourChannel;

