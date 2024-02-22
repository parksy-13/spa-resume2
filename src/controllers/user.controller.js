import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';
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
                return res.status(400).json({ message: "이메일은 필수값입니다." });
            }
            if (!password) {
                return res.status(400).json({ message: "비밀번호는 필수값입니다." });
            }

            const token = await this.usersService.signInUser(email, password);
            res.cookie('accessToken', token.bearerAccessToken);
            res.cookie('refreshToken', token.bearerRefreshToken);

            return res.status(200).json({message:"로그인에 성공하였습니다."})
        } catch (err) {
            next(err);
        }
    }

    /** 내 정보 조회 API */
    user = async (req, res, next) => {
        try {
            const { userId } = req.user;

            const user = await this.usersService.findUserById(userId);

            return res.status(200).json({ data: user });
        } catch (err) {
            next(err);
        }
    }
}