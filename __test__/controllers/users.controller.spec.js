import {jest} from '@jest/globals';
import { UsersController } from '../../src/controllers/user.controller';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../../src/middlewares/auth.middleware.js';
import dotenv from 'dotenv';

dotenv.config();

const mockUsersService = {
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    createUser: jest.fn()
};

const mockRequest = {
    body: jest.fn(),
    cookie: jest.fn(),
    user: jest.fn()
};

const mockResponse = {
    status: jest.fn(),
    cookie: jest.fn(),
    json: jest.fn(),
    user: jest.fn()
}

const mockNext = jest.fn();
const usersController = new UsersController(mockUsersService);

describe('Users Controller Unit Test',()=>{
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

        // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
        mockResponse.status.mockReturnValue(mockResponse);
    });

    test('createUser Method by Success', async()=>{
        const createUserRequestBodyParams = {
            email: 'Email_Success',
            password: 'Password_Success',
            checkpw: 'Password_Success',
            name: 'Name_Success',
        };
        mockRequest.body = createUserRequestBodyParams;

        const createUserReturnValue = {
            email: 'Email_Success',
            name: 'Name_Success',
        }
        mockUsersService.createUser.mockReturnValue(createUserReturnValue);

        const createUser = await usersController.createUser(mockRequest,mockResponse,mockNext);

        expect(mockUsersService.createUser).toHaveBeenCalledTimes(1);
        // expect(mockUsersService.createUser).toHaveBeenCalledWith(
        // createUserRequestBodyParams.email,
        // // createUserRequestBodyParams.password
        // createUserRequestBodyParams.name
        // );

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(201);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith(
            createUserReturnValue
        );
    })

test('signIn Method by Success')
})
