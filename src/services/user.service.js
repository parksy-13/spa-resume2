import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

  signInUser = async (email, password) => {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("존재하지 않는 이메일입니다.")
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("비밀번호가 일치하지 않습니다.")
    }

    // Access Token을 생성하는 함수
    function createAccessToken(id) {
      const accessToken = jwt.sign(
        { userId: id },
        process.env.SECRET_KEY,
        { expiresIn: '12h' }, // Access Token이 12시간 뒤에 만료되도록 설정합니다.
      );
      return accessToken;
    }

    //Refresh Token을 생성하는 함수
    function createRefreshToken(id) {
      const refreshToken = jwt.sign(
        { userId: id },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }, // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
      );
      return refreshToken;
    }

    const accessToken = createAccessToken(user.userId);
    const refreshToken = createRefreshToken(user.userId);

    const bearerAccessToken = `Bearer ${accessToken}`;
    const bearerRefreshToken = `Bearer ${refreshToken}`;

    return {bearerAccessToken, bearerRefreshToken}
  }
}