import { Request, Response, Router } from 'express';
import Message from '../models/Message';
import * as ITF from '../interfaces';
import checkAuth from '../utils/CheckAuth';
import Post from '../models/Post';
import mongoose, { Types } from 'mongoose';
const routerMessage = Router();


routerMessage.post('/', checkAuth, async(request: Request, response: Response) => {

	const existsPost: ITF.IPost = await Post.findById({_id: request.body.post}) as ITF.IPost;
	if(!existsPost) {
		const err = new Error('Post not found');
		return response.status(404).json({msg: err.message});
	}	
	try {
		const newMessage = new Message({
			message: request.body.message,
			post: request.body.post
		});
		newMessage.emitter = request.user._id;

		const messageSaved = await newMessage.save();
		existsPost.messages.push(messageSaved._id);
		await existsPost.save()
			response.status(201).json(messageSaved);
	} catch (error) {
		console.log(error);
	}
});
routerMessage.put('/', async(request: Request, response: Response) => {});
routerMessage.delete('/:id', checkAuth, async(request: Request, response: Response) => {
	const removeMessage: ITF.IMessage = await Message.findById({_id: request.params.id}) as ITF.IMessage;
	console.log(removeMessage)
	const removeMessagePost: ITF.IPost = await Post.findById({_id: removeMessage.post}) as ITF.IPost;

	
	if(!removeMessagePost){
		const err = new Error('Post not found');
		return response.status(404).json({msg: err.message});
	}

	if(request.user._id.toString() !== removeMessage.emitter.toString()){
		const err = new Error('Invalid action');
		return response.status(404).json({msg: err.message});
	}

	try {
		const arrPosition: number = removeMessagePost.messages.indexOf(removeMessage._id);
		removeMessagePost.messages.splice(arrPosition, 1);
		const [undefined, idRemoved] = await Promise.all([await removeMessagePost.save(), await removeMessage.deleteOne()]);
		response.json(idRemoved)
	} catch (error) {
		console.log(error);
	}
	
});

export default routerMessage;
