import { Request, Response, Router } from 'express';
import * as ITF from '../interfaces';

import Post from "../models/Post";
import checkAuth from '../utils/CheckAuth';

const routerPost = Router();

routerPost.get('/', async(request: Request, response: Response) => {
    const posts: ITF.IPost[] = await Post.find()
			.populate({path: 'owner', select: '_id username email'})
			.populate({path: 'messages'});
    response.json(posts);
});

routerPost.get('/:id', async(request: Request, response: Response) => {

    const { id } = request.params;

    try {
        const post: ITF.IPost = await Post.findById({_id: id})
					.populate({path: 'owner', select: '_id username email'})
					.populate({path: 'messages'}) as ITF.IPost;
        if(!post) return response.status(404).json({msg: 'Resource not found'});
        response.json(post);
    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
});

routerPost.post('/', checkAuth, async(request: Request, response: Response) => {
    try {
        const newPost = new Post({
            title: request.body.title,
            subject: request.body.subject
        });
        newPost.owner = request.user._id;

        const postSaved = await newPost.save();
        response.status(201).json(postSaved);
    } catch (error) {
        response.status(500).json(error);
    }
});

routerPost.put('/:id', checkAuth, async(request: Request, response: Response) => {
    const { id } = request.params;

    try {
        const postUpdate: ITF.IPost = await Post.findById({_id: id}) as ITF.IPost;

        if(postUpdate.owner.toString() !== request.user._id.toString()) return response.status(401).json({msg: 'Access denied'});

        if(!postUpdate) return response.status(404).json({msg: 'Resource not found'});
        
        postUpdate.title = request.body.title || postUpdate.title; 
        postUpdate.subject = request.body.subject || postUpdate.subject; 

        const postUpdated = await postUpdate.save();
        response.json(postUpdated);
    } catch (error) {
        response.status(500).json(error);
    } 
});

routerPost.delete('/:id', checkAuth, async(request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const postDelete: ITF.IPost = await Post.findById({_id: id}) as ITF.IPost;

        if(postDelete.owner.toString() !== request.user._id.toString()) return response.status(401).json({msg: 'Access denied'});

        const postDeleted = await postDelete.deleteOne();
        response.status(204).json(postDeleted);
    } catch (error) {
        response.status(500).json(error);
    }
});

export default routerPost;

 