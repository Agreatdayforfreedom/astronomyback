import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces';

const userSchema = new mongoose.Schema<IUser>({
    username: {type: String, trim: true},
    email: {type: String, require: true, trim: true},
    password: {type: String, require: true, trim: true},
    token: {type: String},
    confirmed: {type: Boolean, default: false},
    imgProfile: {type: String}
}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
}

export default mongoose.model<IUser>('User', userSchema);