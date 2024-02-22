import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {ResumesController} from '../controllers/resume.controller.js';
import {ResumesService} from '../services/resume.service.js';
import {ResumesRepository} from '../repositories/resume.repository.js';

const router = express.Router();
const resumesRepository = new ResumesRepository();
const resumesService = new ResumesService(resumesRepository);
const resumesController = new ResumesController(resumesService);

/* 이력서 작성 API */
router.post('/resumes', authMiddleware, resumesController.createResume);

/* 이력서 수정 API */
router.patch('/resumes/:resumeId', authMiddleware, resumesController.updateResume)

/* 모든 이력서 조회 API */
router.get('/allresumes', resumesController.getResumes);

/* 이력서 상세 조회 API */
router.get('/resume/:resumeId', resumesController.getResume);

/* 이력서 삭제 API */
router.delete('/:resumeId', authMiddleware, resumesController.deleteResume)

export default router;