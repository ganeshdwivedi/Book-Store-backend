const mongoose = require("mongoose");
const dotenv = require('dotenv')

const connectDB = async () => {
    dotenv.config();
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;
