import authMiddleware from '../middlewares/auth.middleware.js';

export class ResumesRepository {
    constructor(prisma) {
        this.prisma = prisma;
    };

    findAllResumes = async (sort) => {
        const resumes = await this.prisma.resumes.findMany({
            select: {
                resumeId: true,
                userId: true,
                name: true,
                title: true,
                content: true,
                status: true,
                createdAt: true
            },
            orderBy:
                { [sort.orderKey]: sort.orderValue }

        });

        return resumes;
    }

    findByResumeId = async (resumeId) => {
        const resume = await this.prisma.resumes.findFirst({
            where: { resumeId: +resumeId },
            select: {
                resumeId: true,
                userId: true,
                name: true,
                title: true,
                content: true,
                status: true,
                createdAt: true
            }
        });

        return resume;
    }

    createResume = async (data) => {
        const resume = await this.prisma.resumes.create({data});

        return resume;
    }


    updateResume = async (resumeId, updatedData) => {
        const updatedResume = await this.prisma.resumes.update({
            where: { resumeId: +resumeId },
            data: {
                ...updatedData
            }
        })

        return updatedResume;
    }

    deleteResume = async (resumeId) => {
        const deletedResume = await this.prisma.resumes.delete({
            where: { resumeId: +resumeId }
        });

        return deletedResume;
    }
}