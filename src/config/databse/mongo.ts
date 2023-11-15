import mongoose from "mongoose";

export default ()=>{
    const url = process.env.MONGO_URI
    let uri = ''
    if(url) uri = url

    mongoose.set('strictQuery',false)
    mongoose
        .connect(uri)
        .then(()=>{
            console.log('Database connected');
        })
        .catch((err)=>{
            console.log(`Database Connection failed :${err}`);
        })
}