



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL;
export const LOGOUT_MARKER_KEY = 'indiaTubeLoggedOut';

const getAuthHeader = (state) => {
    const token = state?.auth?.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const initialState = {
    user: null,
    loading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    status: false,
};

export const register = createAsyncThunk(`${API_BASE}/api/v1/account/signup`, async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE}/api/v1/account/signup`, userData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// export const login = createAsyncThunk(`${API_BASE}api/v1/account/login`, async (userData, { rejectWithValue }) => {
//     try {
//         const response = await axios.post(`${API_BASE}/api/v1/account/login`, userData);
//         return response.data.data;
//     } catch (error) {
//         return rejectWithValue(error.response.data.message);
//     }
// });
export const login = createAsyncThunk(`${API_BASE}/api/v1/account/login`, async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE}/api/v1/account/login`, userData, { withCredentials: true });
        localStorage.removeItem(LOGOUT_MARKER_KEY);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


export const logout = createAsyncThunk(`${API_BASE}/api/v1/account/logout`, async (_, { getState }) => {
    try {
        await axios.post(`${API_BASE}/api/v1/account/logout`, {}, {
            headers: getAuthHeader(getState()),
            withCredentials: true,
        });
    } catch (error) {
        console.warn('Logout request failed; clearing local session anyway:', error);
    }
    localStorage.setItem(LOGOUT_MARKER_KEY, 'true');
    return true;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = Boolean(action.payload);
        },
        setAuth: (state, action) => {
            state.user = action.payload?.user || null;
            state.accessToken = action.payload?.accessToken || null;
            state.refreshToken = action.payload?.refreshToken || null;
            state.status = Boolean(action.payload?.user);
        },
        setTokens: (state, action) => {
            state.accessToken = action.payload?.accessToken || state.accessToken;
            state.refreshToken = action.payload?.refreshToken || state.refreshToken;
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.status = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.status =  false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                return {
                    ...state,
                    status: false,
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    error: null,
                };
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.error = action.payload;
            });
    },
});

export const { setUser, setAuth, setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
