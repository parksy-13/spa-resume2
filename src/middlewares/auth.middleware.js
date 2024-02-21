import jwt from 'jsonwebtoken';
import { prisma } from '../../config/index.js';

export default async function (req, res, next) {
    try {
        const { accessToken } = req.cookies;
        // user의 쿠키가 존재하는지 확인
        if (!accessToken) throw new Error('요청한 사용자의 토큰이 존재하지 않습니다.');

        //accessToken "Bearer dfsasdf(아무말)"
        const [tokenType, token] = accessToken.split(' ');
        if (tokenType !== 'Bearer') throw new Error('토큰 타입이 Bearer 형식이 아닙니다.');

        /*verify()는 첫 번째 인자로는 토큰 문자열을 받고, 두 번째 인자로는 sign() 함수와 동일하게 키를 받음.*/
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        /*token에서 id 가져오기*/
        const userId = decodedToken.userId;

        const userCheck = await prisma.users.findFirst({
            where: { userId: +userId }
        });
        if (!userCheck) throw new Error('로그인이 필요합니다.');

        req.user = userCheck;

        next();
    } catch (error) {
        if(error.name==='TokenExpiredError'){
            return res.status(401).json({message:'토큰이 만료되었습니다.'});
        }
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({message: '토큰이 조작되었습니다.'});
        }
        return res.status(400).json({ message: error.message });
    }
}