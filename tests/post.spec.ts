import mongoose from 'mongoose';
import server from '../src/index';
import Post from '../src/models/Post';
import {request} from './utils/index'

describe('POSTS', () => {
	let token: string;
	let idPost: string;

	beforeAll(async() => {
		await Post.deleteMany();

		const response = await request.post('/api/auth/signin')
			.set('content-type', 'application/json')
			.send({username: 'soma', password: 'password'});
		expect(response.statusCode).toBe(200);
		expect(response.body).toBeDefined();
		token = response.body.token;
	});

	describe('[POST] new post', () => {
		test('it should create a post', async(): Promise<void> => {
			const response = await request.post('/api/post')
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${token}`)
				.send({title: 'a title', subject: 'a subject'});
			expect(response.statusCode).toBe(201);
			expect(response.body).toBeDefined();
		});

		test('it is required the token', async(): Promise<void> => {
			const response = await request.post('/api/post')
				.set('content-type', 'application/json')
				.send({title: 'a title', subject: 'a subject'});
			expect(response.statusCode).toBe(401);
			expect(response.body.msg).toEqual('Access denied');
		});
	});

	describe('[GET] get posts', () => {
		test('get all posts', async(): Promise<void> => {
			const response = await request.get('/api/post')
				.set('content-type', 'application/json')
			expect(response.statusCode).toBe(200);
			expect(response.body[0]._id).toBeDefined();
			idPost = response.body[0]._id;
		});

		test('get specific post', async(): Promise<void> => {
			const response = await request.get(`/api/post/${idPost}`)
				.set('content-type', 'application/json')
			expect(response.statusCode).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body._id).toEqual(idPost);
		});
	});

	describe('[PUT] update post', () => {
		test('it should update a post', async(): Promise<void> => {
			const response = await request.put(`/api/post/${idPost}`)
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${token}`)
				.send({title: 'a title UPDATED', subject: 'a subject UPDATED'});
			expect(response.statusCode).toBe(200);
			expect(response.body.title).toEqual('a title UPDATED');
		});
	});

	describe('[DELETE] delete post', () => {
		test('it should delete a post', async(): Promise<void> => {
			const response = await request.put(`/api/post/${idPost}`)
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${token}`)
			expect(response.statusCode).toBe(200);
		});
	});
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});