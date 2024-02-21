import authMiddleware from '../middlewares/auth.middleware.js';

export class ResumesRepository {
    constructor(prisma) {
        this.prisma = prisma;
    };

    findAllResumes = async () => {
        const resumes = await this.prisma.resumes.findMany();

        return resumes;
    }

    findByResumeId = async (resumeId) => {
        const resume = await this.prisma.resumes.findFirst({ where: { resumeId: +resumeId } });

        return resume;
    }

    updateResume = async(resumeId, updatedData)=>{
        const updatedResume = await this.prisma.posts.update({
            where:{resumeId: +resumeId},
            data:{
                ...updatedData
            }
        })

        return updatedResume;
    }

    deleteResume = async(resumeId)=>{
        const deletedResume = await this.prisma.resumes.delete({
            where:{resumeId:+resumeId}
        });

        return deletedResume;
    }
}