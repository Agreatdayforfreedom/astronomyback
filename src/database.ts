import mongoose from 'mongoose';

export const runDatabase = async() => {
    try {
        const database = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(database.connection.name);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}