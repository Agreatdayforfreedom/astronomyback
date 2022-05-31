import { Request, Response, Router } from 'express';
import { nanoid } from 'nanoid';
import generateJwt from '../helpers/generateJwt';
import * as ITF from '../interfaces';

import User from '../models/User';
import checkAuth from '../utils/CheckAuth';

const routerUser = Router();

routerUser.post('/signup', async(request: Request, response: Response) => {
    try {
        const userExists: ITF.IUser = await User.findOne({email: request.body.email}) as ITF.IUser;
        if(userExists){
            const err = new Error('Email already exists.');
            return response.status(400).json({msg: err.message});
        }
        if(request.body.password.length < 6){
            const err = new Error('The password must be at least 6 characters');
            return response.status(400).json({msg: err.message});
        }
        const newUser = new User({
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        }); 
        newUser.token = nanoid();

        await newUser.save();
        response.status(201).json({msg: 'User registered successfully'});


    } catch (error) {
       const err = new Error('There was a mistake');
       return response.status(500).json({msg: err.message});
    }

});

routerUser.post('/signin', async(request: Request, response: Response) => {
    const { username, password } = request.body;
    try {
        const userExists: ITF.IUser = await User.findOne({username}) as ITF.IUser;
        if(!userExists){
            const err = new Error('Invalid username or password');
            return response.status(400).json({msg: err.message});
        }
        if(!await userExists.comparePassword(password)){
            const err = new Error('Invalid username or password');
            return response.status(400).json({msg: err.message});
        }

        response.json({
            token: generateJwt(userExists._id)
        });

    } catch (error) {
       const err = new Error('There was a mistake');
       return response.status(500).json({msg: err.message});
    }
});
routerUser.get('/confirm/:id', (request: Request, response: Response) => {})


routerUser.get('/profile', checkAuth, (request: Request, response: Response) => {
    response.json(request.user)
});

export default routerUser;