import { jest } from '@jest/globals';
import { UsersService } from '../../src/services/user.service.js';

let mockUsersRepository = {
    findUserById: jest.fn(),
    findUserByEmail: jest.fn(),
    createUser: jest.fn()
};

let usersService = new UsersService(mockUsersRepository);

describe('Users Service Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    })

    test('findUserById Method', async () => {
        const sampleUser = {
            "userId": 1,
            "email": "asdf@gmail.com",
            "name": "테스트1",
            "createdAt": "2024-02-20T14:52:20.737Z"
        };

        mockUsersRepository.findUserById.mockReturnValue(sampleUser);

        const findUser = await usersService.findUserById(1);

        expect(findUser).toEqual(sampleUser);
        expect(mockUsersRepository.findUserById).toHaveBeenCalledTimes(1);
    });

    test('findUserByEmail Method', async () => {
        const sampleUser = {
            "userId": 1,
            "email": "asdf@gmail.com",
            "name": "테스트1",
            "createdAt": "2024-02-20T14:52:20.737Z"
        };

        mockUsersRepository.findUserByEmail.mockReturnValue(sampleUser);

        const findUser = await usersService.findUserByEmail("asdf@gmail.com");

        expect(findUser).toEqual(sampleUser);
        expect(mockUsersRepository.findUserByEmail).toHaveBeenCalledTimes(1);
    });

    test('createUser Method', async () => {
        const sampleUser = {
            "userId": 1,
            "email": "asdf@gmail.com",
            "password":"123456",
            "name": "테스트1",
            "createdAt": "2024-02-20T14:52:20.737Z"
        };
        mockUsersRepository.findUserByEmail.mockReturnValue(null);
        mockUsersRepository.createUser.mockReturnValue(sampleUser);

        const createdUser = await usersService.createUser("asdf@gmail.com", "123456", "테스트1");
        
        expect(mockUsersRepository.findUserByEmail).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.findUserByEmail).toHaveBeenCalledWith(sampleUser.email);

        expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.createUser).toHaveBeenCalledWith(
            sampleUser.email, sampleUser.password, sampleUser.name
        );

        //userId undefined error 뜸
        expect(createdUser).toEqual({
            userId: sampleUser.userId,
            email: sampleUser.email,
            name: sampleUser.name,
            createdAt: sampleUser.createdAt
          });
    })
})