import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {UsersController} from '../controllers/user.controller.js';
import {UsersService} from '../services/user.service.js';
import {UsersRepository} from '../repositories/user.repository.js';

const router = express.Router();

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

/** 회원가입 API */
router.post('/sign-up', usersController.createUser);

/** 로그인 API */
router.post('/sign-in', usersController.signIn)


/** 내 정보 조회 API */
router.get('/user', authMiddleware, usersController.user);

export default router;