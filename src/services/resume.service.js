export class ResumesService {
    constructor(resumesRepository) {
        this.resumesRepository = resumesRepository;
    }

    findAllResumes = async (orderValue) => {
        const resumes = await this.resumesRepository.findAllResumes();

        if (orderValue === 'asc') {
            resumes.sort((a, b) => {
                return a.createdAt - b.createdAt;
            });

            return resumes.map((resume) => {
                return {
                    resumeId: resume.resumeId,
                    title: resume.title,
                    content: resume.content,
                    name: resume.name,
                    status: resume.status,
                    createdAt: resume.createdAt
                }
            })
        } else if (orderValue === 'desc') {
            resumes.sort((a, b) => {
                return b.createdAt - a.createdAt;
            });

            return resumes.map((resume) => {
                return {
                    resumeId: resume.resumeId,
                    title: resume.title,
                    content: resume.content,
                    name: resume.name,
                    status: resume.status,
                    createdAt: resume.createdAt
                }
            })
        }
    }

    findByResumeId = async (resumeId) => {
        const resume = await this.resumesRepository.findByResumeId(resumeId);

        return {
            resumeId: resume.resumeId,
            title: resume.title,
            content: resume.content,
            name: resume.name,
            status: resume.status,
            createdAt: resume.createdAt
        }
    }

    updateResume = async (resumeId, updatedData) => {
        const resume = await this.resumesRepository.findByResumeId(resumeId);

        await this.resumesRepository.updateResume(resumeId, updatedData);

        const updatedResume = await this.resumesRepository.findByResumeId(resumeId);

        return {
            resumeId: resume.resumeId,
            title: resume.title,
            content: resume.content,
            name: resume.name,
            status: resume.status,
            createdAt: resume.createdAt
        }
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