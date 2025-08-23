import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice.js'
import seekerJobReducer from '../features/seeker/seekerJobSlice.js'
import seekerProfileReducer from '../features/seeker/seekerProfileSlice.js'
const store = configureStore({
  reducer: {
    auth: authReducer,
    seekerJob: seekerJobReducer,
    seekerProfile: seekerProfileReducer
  },
});

export default store;