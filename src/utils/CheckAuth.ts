import { Request, Response, NextFunction } from 'express';
import * as ITF from '../interfaces';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const checkAuth = async(request: Request, response: Response, next: NextFunction) => {
    let token: string = '';
    const simple: string = <string>request.headers.authorization;

    try {
        if(simple && simple.toLowerCase().startsWith('bearer')){
            token = simple.split(' ')[1];
            
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as ITF.IPayload;
            request.user = await User.findById({_id: decoded._id as string}).select('-password -confirmed -token -updatedAt');
    
    
            return next()
        }
    
        if(token === ''){
            const err = new Error('Access denied');
            return response.status(401).json({msg: err.message});
        }
    } catch (error) {
        return response.status(500).json({msg: 'Error in authorization'});
    }
}

export default checkAuth;
