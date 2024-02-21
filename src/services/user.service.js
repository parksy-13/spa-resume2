export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  findUserById = async (userId) => {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) throw new Error('존재하지 않는 유저입니다.');

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };
  }

  findUserByEmail = async (email) => {
    const user = await this.usersRepository.findUserByEmail(email);

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }
  }

  createUser = async (email, password, name) => {
    const user = await this.usersRepository.findUserByEmail(email);
    if (user) {
      throw new Error('이미 존재하는 이메일입니다.')
    }

    const createdUser = await this.usersRepository.createUser(email, password, name);

    return {
      userId: createdUser.userId,
      email: createdUser.email,
      name: createdUser.name,
      createdAt: createdUser.createdAt
    }
  }
}