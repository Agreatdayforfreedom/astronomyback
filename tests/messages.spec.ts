import mongoose from 'mongoose';
import server from '../src/index';
// import Post from '../src/models/Post';
import Message from '../src/models/Message';
import {request, item_messageUpdate} from './utils/index'

describe('MESSAGE', () => {
	let idPost: string;
	let idMessage: string;
	let token: string;

	//if message is deleted
	let isDeleted: boolean = false;
	let isUpdated: boolean = false;
	beforeAll(async() => {
		await Message.deleteMany();

		// get the post that was created in post.test
		const responsePost = await request.get('/api/post')
			.set('content-type', 'application/json');
		expect(responsePost.statusCode).toBe(200);
		idPost = responsePost.body[0]._id;


		// get auth
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

	describe('[PUT] update message', () => {
		test('it should update message and update in the messages posts', async(): Promise<void> => {
			const response = await request.put(`/api/message/${idMessage}`)
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${token}`)
				.send({message: item_messageUpdate})
			expect(response.statusCode).toBe(200);
			expect(response.body.message).toEqual(item_messageUpdate);
			isUpdated = true;
		});
	});

	describe('[DELETE] delete message', () => {
		test('delete message', async (): Promise<void> => {
			const response = await request.delete(`/api/message/${idMessage}`)
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${token}`)
			expect(response.statusCode).toBe(200);
			expect(response.body._id).toBeDefined();
			isDeleted = true;
			isUpdated = false;
		});
	});

	
	afterEach(async() => {
		//validate if the message is in the array post and is consistent
		const response = await request.get(`/api/post/${idPost}`)
		.set('content-type', 'application/json')
		expect(response.statusCode).toBe(200); 
		if(isDeleted){
			expect(response.body.messages).toEqual([]);
		} else if(isUpdated) { 
			expect(response.body.messages[0].message).toEqual(item_messageUpdate)
		} else {
		 expect(response.body.messages[0]).toBeDefined();
		 expect(response.body.messages[0]._id.toString()).toEqual(idMessage.toString());
		}
	});
});

afterAll(async() => {
	mongoose.connection.close();
	server.close();
});
