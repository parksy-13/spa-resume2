import { EntitySchema } from "typeorm";

export default new EntitySchema({
    name: "Resumes",
    tableName: "Resumes",
    columns: {
        resumeId: {
            primary: true,
            type: "int",
            generated: true,
        },
        userId: {
            type: "int",
        },
        name: {
            type: "varchar",
        },
        title: {
            type: "varchar",
        },
        content: {
            type: "text",
        },
        status: {
            type: "varchar",
        },
        createdAt: {
            type: "datetime",
        },
    },
    relations: {
        users: {
            target: "Users",
            type: "many-to-one",
            joinTable: true,
            joinColumn: { name: 'userId' },
            cascade: true
        }
    }
})