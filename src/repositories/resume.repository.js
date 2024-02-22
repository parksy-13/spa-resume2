import dataSource from '../typeorm/index.js';

export class ResumesRepository {
    findAllResumes = async (sort) => {
        const resumes = await dataSource.getRepository('Resumes').find({
            select: {
                resumeId: true,
                userId: true,
                name: true,
                title: true,
                content: true,
                status: true,
                createdAt: true
            },
            order:
                { [sort.orderKey]: sort.orderValue }
        });

        return resumes;
    }

    findByResumeId = async (resumeId) => {
        const resume = await dataSource.getRepository('Resumes').findOne({
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
        })
        return resume;
    }

    createResume = async (data) => {
        const resume = await dataSource.getRepository('Resumes').insert(data);

        return resume;
    }


    updateResume = async (resumeId, updatedData) => {
        const updatedResume = await dataSource.getRepository('Resumes').update(
             {resumeId: +resumeId} , updatedData)

        return updatedResume;
    }

    deleteResume = async (resumeId) => {
        const deletedResume = await dataSource.getRepository('Resumes').delete({ resumeId: +resumeId });

        return deletedResume;
    }
}