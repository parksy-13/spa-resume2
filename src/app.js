import express from 'express';
import cookieParser from 'cookie-parser';
import UsersRouter from './routes/users.router.js';
import ResumesRouter from './routes/resumes.router.js';
import ErrorHandlingMiddleware from './middlewares/error.middleware.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3022;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api',[UsersRouter, ResumesRouter]);

app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});