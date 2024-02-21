import { prisma } from '../../config/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';
import { Prisma } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

export class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    /** 회원가입 API */
    createUser = async (req, res, next) => {
        try {
            const { email, password, checkpw, name } = req.body;

            if (!email) {
                throw new Error("이메일은 필수값입니다.")
            }
            if (!password) {
                throw new Error("비밀번호는 필수값입니다.")
            }
            if (!checkpw) {
                throw new Error("비밀번호 확인은 필수값입니다.")
            }
            if (!name) {
                throw new Error("이름은 필수값입니다.")
            }
            const isExistUser = await this.usersService.findUserByEmail(email)

            if (isExistUser) {
                throw new Error("이미 존재하는 이메일입니다.")
            }

            if (password.length < 6) {
                throw new Error("비밀번호는 6자리 이상이어야합니다.")
            }

            if (!(password === checkpw)) {
                throw new Error("비밀번호와 비밀번호 확인이 다릅니다.")
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.usersService.createUser(
                email,
                hashedPassword,
                name
            );

            return res.status(201).json(
                {
                    email,
                    name
                }
            );
        }
        catch (err) {
            next(err);
        }
    }

    /** 로그인 API */
    signIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email) {
                throw new Error("이메일은 필수값입니다.")
            }
            if (!password) {
                throw new Error("비밀번호는 필수값입니다.")
            }

            const user = await this.usersService.findUserByEmail(email);

            if (!user) {
                throw new Error("존재하지 않는 이메일입니다.")
            }

            if (!(await bcrypt.compare(password, user.password))) {
                throw new Error("비밀번호가 일치하지 않습니다.")
            }

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

            /*개발자도구나 insomnia 쿠키에서 확인할 수 있다.*/
            res.cookie('accessToken', `Bearer ${accessToken}`);
            res.cookie('refreshToken', `Bearer ${refreshToken}`);

            return res.status(200).json({ message: '로그인에 성공하였습니다.' });
        } catch (err) {
            next(err);
        }
    }

    /** 내 정보 조회 API */
    user = async (req, res, next) => {
        try {
            authMiddleware
            const { userId } = req.user;

            const user = await this.usersService.findUserById(userId);

            return res.status(200).json({ data: user });
        } catch (err) {
            next(err);
        }
    }
}