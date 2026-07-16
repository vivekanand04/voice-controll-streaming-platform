


// src/routes/Routing.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// NOTE: remove Provider from here if your main.jsx already wraps the app with Provider
import { Provider } from "react-redux";
import store from "../store/store.js";
import VoiceCommandsDocs from "../components/VoiceCommandsDocs.jsx";
import App from "../App";
import Trending from "../components/Trending.jsx";
import {
    Home,
    YourChannel,
    History,
    Playlist,
    Like,
    CustomizeChannel,
    Signup,
    Login,
    Settings,
    Shorts,
    Video,
    UploadVideo,
    AllVideo,
    AuthLayout,
    Main,
    Channel,

} from "../components";
import Movies from "../components/Movies.jsx";
import Music from "../components/Music.jsx";
import SearchResults from "../components/SearchResults.jsx";

function Routing() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    {/* Keep your App layout at '/' but redirect index to /home */}
                    <Route
                        path="/"
                        element={<App />}
                    >
                        {/* When user opens '/', redirect to /home */}
                        <Route index element={<Navigate to="/home" replace />} />

                        {/* Public routes - accessible without authentication */}
                        <Route
                            path="home"
                            element={<Home />}
                        />

                        <Route
                            path="search/:query"
                            element={<SearchResults />}
                        />

                        <Route
                            path="your_channel/*"
                            element={
                                <AuthLayout>
                                    <YourChannel />
                                </AuthLayout>
                            }
                        >
                            <Route index element={<AllVideo />} />
                            <Route
                                path="upload_video"
                                element={
                                    <AuthLayout>
                                        <UploadVideo />
                                    </AuthLayout>
                                }
                            />
                        </Route>

                        {/* Public routes - content depends on auth state */}
                        <Route
                            path="history"
                            element={<History />}
                        />
                        <Route
                            path="like"
                            element={<Like />}
                        />

                        {/* Public routes - content depends on auth state */}
                        <Route
                            path="playlist"
                            element={<Playlist />}
                        />
                        <Route
                            path="subscriptions"
                            element={
                                <AuthLayout>
                                    <Home />
                                </AuthLayout>
                            }
                        />
                        <Route
                            path="watch/:id"
                            element={<Video />}
                        />
                        <Route
                            path="channel/:id"
                            element={<Channel />}
                        />
                        <Route path="/trending" element={<Trending />} />
                        <Route path="/music" element={<Music />} />
                        <Route path="/movies" element={<Movies />} />
                        <Route path="/docs" element={<VoiceCommandsDocs />} />
                        <Route
                            path="shorts"
                            element={<Shorts />}
                        />

                        {/* Public routes - content depends on auth state */}
                        <Route
                            path="settings"
                            element={<Settings />}
                        />

                        {/* Protected routes - require authentication */}
                        <Route
                            path="customize_channel"
                            element={
                                <AuthLayout>
                                    <CustomizeChannel />
                                </AuthLayout>
                            }
                        />


                    </Route>

                    {/* Auth routes (accessible directly) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default Routing;
