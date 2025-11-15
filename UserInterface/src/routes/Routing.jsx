



// // Routing.js
// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from '../store/store.js';
// import App from '../App';
// import {
//     Home, YourChannel, History, Playlist, Like,
//     CustomizeChannel, Signup, Login, Settings,
//     Shorts, Video, UploadVideo, AllVideo, AuthLayout, Main
// } from '../components';
// import SearchResults from '../components/SearchResults.jsx';

// function Routing() {
//     return (
//         <Provider store={store}>
//             <BrowserRouter>
//                 <Routes>



//                     <Route path='/' element={

//                         <App />
//                         }>
//                         <Route index element={<Main />} />

//                         <Route path='home' element={
//                             <AuthLayout>
//                                 <Home />
//                             </AuthLayout>
//                         } />

//                         {/* ⬅️ Add Search route here */}
//                         <Route path='search/:query' element={
//                             <AuthLayout>
//                                 <SearchResults />
//                             </AuthLayout>
//                         } />

//                         <Route path='your_channel/*' element={
//                             <AuthLayout>
//                                 <YourChannel />
//                             </AuthLayout>
//                         }>
//                             <Route index element={
//                                 <AuthLayout>
//                                     <AllVideo />
//                                 </AuthLayout>
//                             } />
//                             <Route path='upload_video' element={
//                                 <AuthLayout>
//                                     <UploadVideo />
//                                 </AuthLayout>
//                             } />
//                         </Route>

//                         <Route path='history' element={
//                             <AuthLayout>
//                                 <History />
//                             </AuthLayout>
//                         } />
//                         <Route path='playlist' element={
//                             <AuthLayout>
//                                 <Playlist />
//                             </AuthLayout>
//                         } />
//                         <Route path='like' element={
//                             <AuthLayout>
//                                 <Like />
//                             </AuthLayout>
//                         } />
//                         <Route path='subscriptions' element={
//                             <AuthLayout>
//                                 <Home />
//                             </AuthLayout>
//                         } />
//                         <Route path='shorts' element={
//                             <AuthLayout>
//                                 <Shorts />
//                             </AuthLayout>
//                         } />
//                         <Route path='watch/:id' element={
//                             <AuthLayout>
//                                 <Video />
//                             </AuthLayout>
//                         } />
//                         <Route path='customize_channel' element={
//                             <AuthLayout>
//                                 <CustomizeChannel />
//                             </AuthLayout>
//                         } />
//                         <Route path='settings' element={
//                             <AuthLayout>
//                                 <Settings />
//                             </AuthLayout>
//                         } />
//                     </Route>

//                     <Route path='/login' element={<Login />} />
//                     <Route path='/signup' element={<Signup />} />
//                 </Routes>
//             </BrowserRouter>
//         </Provider>
//     );
// }

// export default Routing;


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

} from "../components";
import Movies from "../components/Movies.jsx";
import Music from "../components/Music.jsx";
import SearchResults from "../components/SearchResults.jsx";

function Routing() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    {/* Keep your App layout at '/' but redirect index to /login */}
                    <Route
                        path="/"
                        element={<App />}
                    >
                        {/* When user opens '/', redirect to /login */}
                        <Route index element={<Navigate to="/login" replace />} />

                        <Route
                            path="home"
                            element={
                                <AuthLayout>
                                    <Home />
                                </AuthLayout>
                            }
                        />

                        <Route
                            path="search/:query"
                            element={
                                <AuthLayout>
                                    <SearchResults />
                                </AuthLayout>
                            }
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

                        <Route
                            path="history"
                            element={
                                <AuthLayout>
                                    <History />
                                </AuthLayout>
                            }
                        />
                        <Route
                            path="playlist"
                            element={
                                <AuthLayout>
                                    <Playlist />
                                </AuthLayout>
                            }
                        />
                        <Route
                            path="like"
                            element={
                                <AuthLayout>
                                    <Like />
                                </AuthLayout>
                            }
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
                            path="shorts"
                            element={
                                <AuthLayout>
                                    <Shorts />
                                </AuthLayout>
                            }
                        />
                        <Route
                            path="watch/:id"
                            element={
                                <AuthLayout>
                                    <Video />
                                </AuthLayout>
                            }
                        />
                        <Route
                            path="customize_channel"
                            element={
                                <AuthLayout>
                                    <CustomizeChannel />
                                </AuthLayout>
                            }
                        />
                        <Route
                            path="settings"
                            element={
                                <AuthLayout>
                                    <Settings />
                                </AuthLayout>
                            }
                        />
                        <Route path="/trending" element={<AuthLayout>
                            <Trending />
                        </AuthLayout>} />
                        <Route path="/music" element={<AuthLayout>
                            <Music />
                        </AuthLayout>} />
                        <Route path="/movies" element={<AuthLayout>
                            <Movies />
                        </AuthLayout>} />
                          <Route path="/docs" element={<AuthLayout>
                            <VoiceCommandsDocs />
                        </AuthLayout>} />


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
