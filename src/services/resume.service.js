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
            data: {
                userId,
                name: name,
                title,
                content,
                status: 'APPLY'
            }
        });
        return resume;
    }

    updateResume = async (resumeId, updatedData) => {
        await this.resumesRepository.updateResume(resumeId, updatedData);

        const updatedResume = await this.resumesRepository.findByResumeId(resumeId);

        return updatedResume;
    }

    deleteResume = async (resumeId) => {
        const resume = await this.resumesRepository.findByResumeId(resumeId);
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