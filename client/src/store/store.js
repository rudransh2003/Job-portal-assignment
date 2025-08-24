import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice.js'
import seekerJobReducer from '../features/seeker/seekerJobSlice.js'
import seekerProfileReducer from '../features/seeker/seekerProfileSlice.js'
import employerProfileReducer from '../features/employer/employerProfileSlice.js'
import employerJobsReducer from '../features/employer/employerJobSlice.js'
import adminReducer from '../features/admin/adminJobSlice.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    seekerJob: seekerJobReducer,
    seekerProfile: seekerProfileReducer,
    employerProfile: employerProfileReducer,
    employerJobs: employerJobsReducer,
    admin: adminReducer
  },
});

export default store;