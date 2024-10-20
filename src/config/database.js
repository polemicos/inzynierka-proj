const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://projAdmin:QnH7OJowgOD64cSM@inzproj.wpzxa5a.mongodb.net/?retryWrites=true&w=majority&appName=InzProj", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error: ", err);
    }
};

module.exports = connectDB;
