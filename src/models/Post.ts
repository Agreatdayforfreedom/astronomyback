import mongoose from 'mongoose';

import * as ITF from '../interfaces';

const postSchema = new mongoose.Schema<ITF.IPost>({
    title: {type: String, required: true, trim: true},
    subject: {type: String, required: true, trim: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
}, {
    timestamps: true,
    versionKey: false 
});

export default mongoose.model<ITF.IPost>('Post', postSchema); 