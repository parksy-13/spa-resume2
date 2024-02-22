export class ResumesService {
    constructor(resumesRepository) {
        this.resumesRepository = resumesRepository;
    }

    findAllResumes = async (sort) => {
        const resumes = await this.resumesRepository.findAllResumes(sort);
        return resumes;
    }

    findByResumeId = async (resumeId) => {
        const resume = await this.resumesRepository.findByResumeId(resumeId);

        return resume;
    }

    createResume = async ({ userId, name, title, content }) => {
        const resume = await this.resumesRepository.createResume({
            userId,
            name: name,
            title,
            content,
            status: 'APPLY'
        });
        return resume;
    }

    updateResume = async (resumeId, updatedData, userId) => {
        const userResume = await this.resumesRepository.findByResumeId(resumeId);

        if (!userResume) {
            throw { code: 404, message: '이력서 조회에 실패하였습니다.' }
        }

        if (userResume.userId !== userId) {
            throw { code: 400, message: '본인의 이력서를 수정해야합니다.' }
        }

        await this.resumesRepository.updateResume(resumeId, updatedData);

        const updatedResume = await this.resumesRepository.findByResumeId(resumeId);

        return updatedResume;
    }

    deleteResume = async (resumeId, userId) => {
        const resume = await this.resumesRepository.findByResumeId(resumeId);

        if (!resume) {
            throw { code: 404, message: '이력서 조회에 실패하였습니다.' }
        }

        if (userId !== resume.userId) {
            throw { code: 400, message: '본인의 이력서만 삭제할 수 있습니다.' }
        }

        await this.resumesRepository.deleteResume(resumeId);

        return {
            resumeId: resume.resumeId,
            title: resume.title,
            content: resume.content,
            name: resume.name,
            status: resume.status,
            createdAt: resume.createdAt
        }

    }
}