import mongoose from 'mongoose';
import server from '../src/index';
import Post from '../src/models/Post';
import {request} from './utils/index'

describe('AUTH CONTROLLER', () => {
    beforeAll(async() => {
        await Post.deleteMany();
    });

    describe('[POST] signup', () => {
        test('it should create a user', async() => {
            const response = await request.post('/api/post')
                .set('content-type', 'application/json')
                .send({title: 'a title', subject: 'a subject'});
            expect(response.status).toBe(201);
            expect(response.body).toBeDefined();
        });

        test('simple test', () => {
            expect(1 + 1).toBe(2)
        })
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});