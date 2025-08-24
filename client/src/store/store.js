import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice.js'
import seekerJobReducer from '../features/seeker/seekerJobSlice.js'
import seekerProfileReducer from '../features/seeker/seekerProfileSlice.js'
import employerProfileReducer from '../features/employer/employerProfileSlice.js'
import employerJobsReducer from '../features/employer/employerJobSlice.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    seekerJob: seekerJobReducer,
    seekerProfile: seekerProfileReducer,
    employerProfile: employerProfileReducer,
    employerJobs: employerJobsReducer,
  },
});

export default store;