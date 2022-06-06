import mongoose from 'mongoose';
import * as ITF from '../interfaces';

const messageSchema = new mongoose.Schema<ITF.IMessage>({
	message: { type: String, required: true, trim: true },
	emitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
}, {
	timestamps: true,
	versionKey: false
});

export default mongoose.model<ITF.IMessage>('Message', messageSchema);
