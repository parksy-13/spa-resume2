import express from 'express';
import { prisma } from '../../config/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { Prisma } from '@prisma/client'

const router = express.Router();

/* 이력서 작성 API */
router.post('/resumes', authMiddleware, async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const { userId, name } = req.user;

        if (!title) {
            return res.status(400).json({ message: '제목을 작성하세요.' })
        }
        if (!content) {
            return res.status(400).json({ message: '내용을 작성하세요.' })
        }

        const resume = await prisma.resumes.create({
            data: {
                userId: +userId,
                name: name,
                title,
                content
            }
        });

        return res.status(201).json({ data: resume });
    } catch (err) {
        next(err);
    }
});

/* 이력서 수정 API */
router.patch('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
    const updatedData = req.body;
    const { userId } = req.user;
    const resumeId = req.params.resumeId;

    const userResume = await prisma.resumes.findFirst({
        where: { resumeId: +resumeId }
    });

    if (!userResume) return res.status(404).json({ message: '이력서 조회에 실패하였습니다.' });

    if (userResume.userId !== userId) {
        return res.status(400).json({ message: '본인의 이력서를 수정해야합니다.' })
    }

    console.log(updatedData.status);

    if (!updatedData) return res.status(400).json({ message: '수정할 내용이 작성되지 않았습니다.' });

    await prisma.resumes.update({
        data: {
            ...updatedData
        },
        where: {
            resumeId: +resumeId
        }
    });
    return res.status(200).json({ message: '이력서 수정에 성공하였습니다.' });
})


/* 모든 이력서 조회 API */
router.get('/allresumes', async (req, res, next) => {
    try {
        const orderKey = req.query.orderKey ?? 'resumeId';
        const orderValue1 = req.query.orderValue ?? 'desc';

        const orderValue = orderValue1.toLowerCase();

        if (!['resumeId', 'status'].includes(orderKey)) {
            return res.status(400).json({ message: 'orderKey는 resumeId나 status 중 하나를 작성하세요' })
        }
        if (!(orderValue === 'asc' || orderValue === 'desc')) {
            return res.status(400).json({ message: '정렬 순서를 asc나 desc 중 하나를 작성하세요' });
        }

        const resumes = await prisma.resumes.findMany({
            select: {
                resumeId: true,
                title: true,
                content: true,
                name: true,
                status: true,
                createdAt: true
            },
            orderBy: {
                createdAt: orderValue
            }
        });
        return res.status(200).json({ data: resumes });
    }
    catch (err) {
        next(err);
    }
});

/* 이력서 상세 조회 API */
router.get('/resume/:resumeId', async (req, res, next) => {
    const resumeId = req.params.resumeId;

    const resume = await prisma.resumes.findFirst({
        where: {
            resumeId: +resumeId
        },
        select: {
            resumeId: true,
            title: true,
            content: true,
            name: true,
            status: true,
            createdAt: true
        }
    });
    if (!resume) {
        return res.status(404).json({ message: '존재하지 않는 이력서입니다.' })
    }
    return res.status(200).json({ data: resume });
});

/* 이력서 삭제 API */
router.delete('/:resumeId', authMiddleware, async (req, res) => {
    const { userId } = req.user;
    const resumeId = req.params.resumeId;

    const userResume = await prisma.resumes.findFirst({
        where: {
            resumeId: +resumeId
        }
    });
    if (!userResume) return res.status(404).json({ message: '이력서 조회에 실패하였습니다.' });

    if (userId !== userResume.userId) {
        return res.status(401).json({ message: '본인의 이력서만 삭제할 수 있습니다.' });
    }

    await prisma.resumes.delete({
        where: {
            resumeId: +resumeId
        }
    });
    return res.status(200).json({ message: '이력서 삭제에 성공하였습니다.' });

})

export default router;