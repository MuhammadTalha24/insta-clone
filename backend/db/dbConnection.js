import mongoose from "mongoose"

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DataBase Connected!")
    } catch (error) {
        console.log(error)
    }
}

export default dbConnection