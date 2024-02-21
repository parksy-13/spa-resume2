export class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    };

    findUserById = async (userId) => {
        const user = await this.prisma.users.findFirst({
            where: { userId: +userId },
        });
        return user;
    };

    findUserByEmail = async (email) => {
        const user = await this.prisma.users.findFirst({
            where: { email: email }
        });
        return user;
    };

    createUser = async (email, password, name) => { 
        const createdUser = await this.prisma.users.create({
            data: {
                email,
                password,
                name
            }
        });

        return createdUser;
    };
}