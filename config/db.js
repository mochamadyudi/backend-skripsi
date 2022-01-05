import mongoose from 'mongoose'
const database = process.env.DATABASE || "mongodb+srv://vodonesia:arjuna46@vodonesia.vysbe.mongodb.net/vodonesia?retryWrites=true&w=majority"
const connectDB = async ()=> {
    try{
        await mongoose.connect(database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        }).then(()=> {
                console.log("Connected to MongoDB...")
            })
            .catch((err)=> {
                console.error({
                    testing:"error bosku",
                    message:err.message
                })
            })

    }catch(err){
        console.error(err.message)
        process.exit(1)
    }
}

export default connectDB
