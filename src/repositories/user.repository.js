import dataSource from '../typeorm/index.js';

export class UsersRepository {

    findUserById = async (userId) => {
        const user = await dataSource.getRepository('Users').findOne({
            where: { userId: +userId },
        });
        return user;
    };

    findUserByEmail = async (email) => {
        const user = await dataSource.getRepository('Users').findOne({
            where: { email: email },
        });
        return user;
    };

    createUser = async (email, password, name) => {
        const createdUser = await dataSource.getRepository('Users').insert({
            email,
            password,
            name
        });

        return createdUser;
    };
}