import express from 'express';
import {prisma} from '../../config/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';
import { Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import {UsersController} from '../controllers/user.controller.js';
import {UsersService} from '../services/user.service.js';
import {UsersRepository} from '../repositories/user.repository.js';

dotenv.config();

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

/** 회원가입 API */
router.post('/sign-up', usersController.createUser);

/** 로그인 API */
router.post('/sign-in', usersController.signIn)


/** 내 정보 조회 API */
router.get('/user', authMiddleware, usersController.user);

export default router;