import mongodb from 'mongoose'
import config from 'config'

const url = config.get("db.detail")
// const database = process.env.DATABASE || "mongodb+srv://vodonesia:arjuna46@vodonesia.vysbe.mongodb.net/vodonesia?retryWrites=true&w=majority"

const connectDB = async ()=> {

    try{
        await mongodb.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(()=> {
                console.log("Connected to MongoDB..."+url)
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
