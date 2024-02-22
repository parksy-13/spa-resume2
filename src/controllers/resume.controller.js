import express from 'express';
import { prisma } from '../../config/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { Prisma } from '@prisma/client'

export class ResumesController {
    constructor(resumesService) {
        this.resumesService = resumesService
    }

    /* 이력서 생성 API */
    createResume = async (req, res, next) => {
        try {
            const { title, content } = req.body;
            const { userId, name } = req.user;

            if (!title) {
                return res.status(400).json({ message: '제목을 작성하세요.' })
            }
            if (!content) {
                return res.status(400).json({ message: '내용을 작성하세요.' })
            }

            const resume = await this.resumesService.createResume({userId, name, title, content});

            return res.status(201).json({ data: resume });
        } catch (err) {
            next(err);
        }
    }

    /* 이력서 전체 조회 API */
    getResumes = async (req, res, next) => {
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

            const resumes = await this.resumesService.findAllResumes({ orderKey, orderValue });
            return res.status(200).json({ data: resumes });
        } catch (err) {
            next(err);
        }
    }

    /* 이력서 상세 조회 API */
    getResume = async (req, res, next) => {
        try {
            const resumeId = req.params.resumeId;

            const resume = await this.resumesService.findByResumeId(resumeId);
            if (!resume) {
                return res.status(404).json({ message: '존재하지 않는 이력서입니다.' })
            }
            return res.status(200).json({ data: resume });
        } catch (err) {
            next(err);
        }
    }

    /* 이력서 수정 API */
    updateResume = async (req, res, next) => {
        try {
            const updatedData = req.body;
            const { userId } = req.user;
            const resumeId = req.params.resumeId;

            const userResume = await this.resumesService.findByResumeId(resumeId);

            if (!userResume) return res.status(404).json({ message: '이력서 조회에 실패하였습니다.' });

            if (userResume.userId !== userId) {
                return res.status(400).json({ message: '본인의 이력서를 수정해야합니다.' })
            }

            if (!updatedData) return res.status(400).json({ message: '수정할 내용이 작성되지 않았습니다.' });

            await this.resumesService.updateResume(resumeId, updatedData);
            return res.status(200).json({ message: '이력서 수정에 성공하였습니다.' });
        } catch (err) {
            next(err);
        }
    }

    /* 이력서 삭제 API */
    deleteResume = async (req, res, next) => {
        try {
            authMiddleware;
            const { userId } = req.user;
            const resumeId = req.params.resumeId;

            const userResume = await this.resumesService.findByResumeId(resumeId);

            if (!userResume) return res.status(404).json({ message: '이력서 조회에 실패하였습니다.' });

            if (userId !== userResume.userId) {
                return res.status(401).json({ message: '본인의 이력서만 삭제할 수 있습니다.' });
            }

            await this.resumesService.deleteResume(resumeId);
            return res.status(200).json({ message: '이력서 삭제에 성공하였습니다.' });
        } catch (err) {
            next(err);
        }
    }
}