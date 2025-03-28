import mongoose from 'mongoose';

export default async function connectToDatabase() {
    const mongoURI = "mongodb://admin:adminpassword@localhost:27017/smart_home?authSource=admin";
    await mongoose.connect(mongoURI);
}