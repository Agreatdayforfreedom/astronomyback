import mongoose from 'mongoose';
import server from '../src/index';
import Post from '../src/models/Post';
import Message from '../src/models/Message';
import {request} from './utils/index'

describe('MESSAGE', () => {
	let idPost: string;
	let idMessage: string;
	let token: string;
	//if message is deleted
	let isDeleted: boolean = true;
	beforeAll(async() => {
		await Message.deleteMany();

		const responsePost = await request.get('/api/post')
			.set('content-type', 'application/json');
		expect(responsePost.statusCode).toBe(200);
		idPost = responsePost.body[0]._id;

		const responseAuth = await request.post('/api/auth/signin')
			.set('content-type', 'application/json')
			.send({username: 'soma', password: 'password'});
		expect(responseAuth.statusCode).toBe(200);
		expect(responseAuth.body).toBeDefined();
		token = responseAuth.body.token;
	});

	describe('[POST] new message', () => {
		test('it should send a new message', async (): Promise<void> => {
			const response = await request.post('/api/message')
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`)
			.send({message: 'new message', post: idPost});
			expect(response.statusCode).toBe(201);
			expect(response.body._id).toBeDefined();
			idMessage = response.body._id;
		});
	});

	describe('[POST] delete message', () => {
		test('delete message', async (): Promise<void> => {
			const response = await request.delete(`/api/message/${idMessage}`)
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${token}`)
			expect(response.statusCode).toBe(200);
			expect(response.body._id).toBeDefined();
			isDeleted = false;
		});
	});

	afterEach(async() => {
		//validate if the message is in the array post
		const response = await request.get(`/api/post/${idPost}`)
		.set('content-type', 'application/json')
		if(isDeleted){
			expect(response.statusCode).toBe(202); // it should fail. try 200
			expect(response.body.messages[0]).toBeDefined();
			expect(response.body.messages[0].toString()).toEqual(idMessage.toString());
		} else {
			expect(response.statusCode).toBe(200);
			expect(response.body.messages).toEqual([]);
		}
	});
});

afterAll(async() => {
	mongoose.connection.close();
	server.close();
});
