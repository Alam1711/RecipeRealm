import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../authentication/firebaseConfig";

interface UserState {
  isLoggedIn: boolean;
  userInfo: {
    id: string;
    name: string;
    email: string;
    username: string | null;
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: null,
  status: "idle",
};

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (email: string) => {
    const getUser = doc(db, "users/", email);
    const getUserData = await getDoc(getUser);
    const username = getUserData?.data()?.username;
    return { email, username };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ id: string; name: string; email: string }>
    ) => {
      state.isLoggedIn = true;
      state.userInfo = { ...action.payload, username: null };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      if (state.userInfo) {
        state.userInfo.username = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.userInfo) {
          state.userInfo.username = action.payload.username;
        }
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { login, logout, setUsername } = userSlice.actions;

export default userSlice.reducer;
