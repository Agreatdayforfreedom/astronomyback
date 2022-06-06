import mongoose from 'mongoose';
import server from '../src/index';
import User from '../src/models/User';
import {request} from './utils/index'

//todo: this does not run on another db 
describe('AUTH', () => {
    beforeAll(async() => {
        await User.deleteMany();
    });

    describe('[POST] signup', () => {
        test('it should create a user', async(): Promise<void> => {
            const response = await request.post('/api/auth/signup')
                .set('content-type', 'application/json')
                .send({username: 'soma', email: 'soma@gmail.com', password: 'password'});
            expect(response.statusCode).toBe(201);
            expect(response.body).toBeDefined();
        });

        test('it should not repeat a user', async(): Promise<void> => {
            const response = await request.post('/api/auth/signup')
                .set('content-type', 'application/json')
                .send({username: 'soma', email: 'soma@gmail.com', password: 'password'});
            expect(response.statusCode).toBe(400);
            expect(response.body).toBeDefined();
        });
    });

    describe('[POST] signin', () => {
        test('should respond with a token', async(): Promise<void> => {
            const response = await request.post('/api/auth/signin')
                .set('content-type', 'application/json')
                .send({username: 'soma', password: 'password'});
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
    });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});