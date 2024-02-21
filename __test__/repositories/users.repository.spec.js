import { describe, jest } from '@jest/globals';
import { UsersRepository } from '../../src/repositories/user.repository.js';

let mockPrisma = {
    users: {
        findFirst: jest.fn(),
        create: jest.fn(),
    }
};

let usersRepository = new UsersRepository(mockPrisma);

describe('Users Repository Unit test', () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    test('createUser Method', async () => {
        //1. 최종적으로 createUser 메서드의 반환값을 설정한다.
        const mockReturn = 'create User Return String'
        mockPrisma.users.create.mockReturnValue(mockReturn);
        //2. createUser 메서드를 실행하기 위한 email, password, name의 데이터를 전달한다.
        const createUserParams = {
            email:'createUserEmail',
            password:'createUserPassword',
            name:'createUserName'
        }
    
        const createUserData = await usersRepository.createUser(
            createUserParams.email,
            createUserParams.password,
            createUserParams.name
        );
    
        // create 메서드의 반환값은 return 값과 동일하다
        expect(createUserData).toEqual(mockReturn);
        // create 메서드는 1번만 실행된다
        expect(mockPrisma.users.create).toHaveBeenCalledTimes(1);
        // create 메서드를 실행할 때 create 메서드는 전달한 email, password, name이 순서대로 전달된다.
        expect(mockPrisma.users.create).toHaveBeenCalledWith({
            data:{
                email: createUserParams.email,
                password: createUserParams.password,
                name: createUserParams.name
            }
        })
      });

      test('findUserById Method', async () => {
        const mockReturn = 'findFirst String';
    
        mockPrisma.users.findFirst.mockReturnValue(mockReturn);
    
        const user = await usersRepository.findUserById();
    
        //findUnique 함수의 반환값은 findUserByEmail의 반환값과 같다.
        expect(user).toBe(mockReturn);
    
        //findUnique 함수는 최종적으로 한번만 호출된다.
        expect(usersRepository.prisma.users.findFirst).toHaveBeenCalledTimes(1);
      });

      test('findUserByEmail Method', async () => {
        const mockReturn = 'findFirst String';
    
        mockPrisma.users.findFirst.mockReturnValue(mockReturn);
    
        const user = await usersRepository.findUserByEmail();
    
        //findUnique 함수의 반환값은 findUserByEmail의 반환값과 같다.
        expect(user).toBe(mockReturn);
    
        //findUnique 함수는 최종적으로 한번만 호출된다.
        expect(usersRepository.prisma.users.findFirst).toHaveBeenCalledTimes(1);
      });
})