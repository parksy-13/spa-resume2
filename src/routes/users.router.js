import express from 'express';
import {prisma} from '../../config/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';
import { Prisma } from '@prisma/client';
import dotenv from 'dotenv';
// import {UsersController} from '../controllers/user.controller.js';
import {UsersService} from '../services/user.service.js';
import {UsersRepository} from '../repositories/user.repository.js';

dotenv.config();

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(prisma);
// const usersController = new UsersController(prisma);

/** 회원가입 API */
router.post('/sign-up', async (req, res, next) => {
    try {
        const { email, password, checkpw, name } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: '이메일은 필수값입니다.' })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: '비밀번호는 필수값입니다.' })
        }
        if (!checkpw) {
            return res.status(400).json({ success: false, message: '비밀번호 확인은 필수값입니다.' })
        }
        if (!name) {
            return res.status(400).json({ success: false, message: '이름은 필수값입니다.' })
        }
        const isExistUser = await prisma.users.findFirst({
            where: { email }
        })

        if (isExistUser) {
            return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
        }

        if (password.length < 6) {
            return res.status(409).json({ message: '비밀번호는 6자리 이상이어야합니다.' });
        }

        if (!(password === checkpw)) {
            return res.status(409).json({ message: '비밀번호와 비밀번호 확인이 다릅니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
                data: {
                    email,
                    password: hashedPassword,
                    name
                }
            });

        return res.status(201).json({
            email,
            name
        });
    }
    catch (err) {
        next(err);
    }
});

/** 로그인 API */
router.post('/sign-in', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: '이메일은 필수값입니다.' })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: '비밀번호는 필수값입니다.' })
        }

        const user = await prisma.users.findFirst({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        const tokenStorages = {};

        // Access Token을 생성하는 함수
        function createAccessToken(id) {
            const accessToken = jwt.sign(
                { userId: id },
                process.env.SECRET_KEY,
                { expiresIn: '12h' }, // Access Token이 12시간 뒤에 만료되도록 설정합니다.
            );
            return accessToken;
        }

        //Refresh Token을 생성하는 함수
        function createRefreshToken(id) {
            const refreshToken = jwt.sign(
                { userId: id },
                process.env.SECRET_KEY,
                { expiresIn: '7d' }, // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
            );
            return refreshToken;
        }

        const accessToken = createAccessToken(user.userId);
        const refreshToken = createRefreshToken(user.userId);

        tokenStorages[refreshToken] = {
            id: user.userId,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        }

        /*개발자도구나 insomnia 쿠키에서 확인할 수 있다.*/
        res.cookie('accessToken', `Bearer ${accessToken}`);
        res.cookie('refreshToken', `Bearer ${refreshToken}`);

        return res.status(200).json({ message: '로그인에 성공하였습니다.' });
    } catch (err) {
        next(err);
    }

})


/** 내 정보 조회 API */
router.get('/user', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.user;

        const user = await prisma.users.findFirst({
            where: { userId: +userId },
            select: {
                userId: true,
                email: true,
                name: true,
                createdAt: true,
            }
        });

        return res.status(200).json({ data: user });
    } catch (err) {
        next(err);
    }
})

export default router;