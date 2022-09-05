const mongoose = require("mongoose");
const uri =
  "mongodb+srv://dipanshu987:dipanshu987@ecommerce.xaoyehs.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_LOCAL_URL || uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true,
    });
    console.log("mongoDB connected: ", conn.connection.host);
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

module.exports = connectDB;
