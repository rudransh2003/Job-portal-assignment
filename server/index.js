import connect from './db/db.js';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import seekerRoutes from './routes/seeker.routes.js'
import employerRoutes from './routes/employer.routes.js'
const app = express();
const PORT = 5000;

app.use(express.json());
connect();
app.use(cors());
app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello, Express Backend is running!");
});

app.use('/auth', authRoutes)
app.use("/seeker", seekerRoutes)
app.use("/employer", employerRoutes)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
