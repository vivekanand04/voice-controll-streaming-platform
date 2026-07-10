import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import defaultAvatar from "../assets/profile-picture-5.jpg";

const API_BASE = import.meta.env.VITE_API_URL;
const CONTENT_TABS = [
  { id: "all", label: "All", to: "/your_channel" },
  { id: "videos", label: "Videos", to: "/your_channel?tab=videos" },
  { id: "shorts", label: "Shorts", to: "/your_channel?tab=shorts" },
];

function YourChannel() {
  const data = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [userdata, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const tabFromUrl = searchParams.get("tab");
  const activeContentTab = CONTENT_TABS.some((tab) => tab.id === tabFromUrl) ? tabFromUrl : "all";
  const isContentRoute = location.pathname === "/your_channel" || location.pathname === "/your_channel/";

  useEffect(() => {
    const idToFetch = data?._id;
    if (!idToFetch) {
      setUserData(null);
      return;
    }

    const controller = new AbortController();
    const fetchUser = async () => {
      setLoading(true);
      setFetchError(null);
      setUserData(data);

      try {
        const response = await axios.get(`${API_BASE}/api/v1/account/userData/${idToFetch}`, {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          withCredentials: true,
          signal: controller.signal,
        });

        const userObj = response?.data?.data ?? response?.data ?? null;
        if (!userObj) {
          setFetchError("Server returned no user object.");
        } else {
          setUserData(userObj);
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.message !== "canceled") {
          console.error("Fetch error:", err);
          if (err.response) {
            setFetchError(`Server ${err.response.status}: ${JSON.stringify(err.response.data)}`);
          } else if (err.request) {
            setFetchError("No response received - network/CORS/server down.");
          } else {
            setFetchError(err.message);
          }
          setUserData(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      controller.abort();
    };
  }, [accessToken, data]);

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
            {loading && !userdata ? (
              <div>Loading user data...</div>
            ) : fetchError && !userdata ? (
              <div className="text-sm text-red-600">Error: {fetchError}</div>
            ) : userdata ? (
              <>
                <img
                  className="w-28 h-28 rounded-full object-cover"
                  src={userdata.avatar || defaultAvatar}
                  alt={userdata.name || "avatar"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultAvatar;
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

          <div className="border-b border-gray-200 mt-6">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
              {CONTENT_TABS.map((tab) => {
                const selected = isContentRoute && activeContentTab === tab.id;
                return (
                  <li key={tab.id} className="me-2">
                    <Link
                      to={tab.to}
                      role="tab"
                      aria-selected={selected}
                      className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                        selected
                          ? "border-gray-950 text-gray-950"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
              <li className="me-2">
                <Link to={"/your_channel/upload_video"} className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300">
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
