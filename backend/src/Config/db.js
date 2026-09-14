import mongoose from "mongoose";
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongodb connected Successfully")
    } catch (error) {
        console.log(`Mongodb failed Connection : `, error.message)
        process.exit(1)
    }
}

export default connectDB;