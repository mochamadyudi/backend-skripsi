import mongodb from 'mongoose'
import 'dotenv/config'

const url = process.env.DB_URI

const connectDB = async function(){
    try{
        await mongodb.connect(url, {
            appname:process.env.DB_NAME,
            dbName: process.env.DB_NAME || 'skripsi',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(()=> {
            console.log('Connected: ',process.env.DB_NAME)
        })
            .catch((err) => {
                console.log(err,'Connected :'+ ' ' +process.env.DB_NAME + ' ' + err?.message)

            })
    }catch(err){
        console.error(err.message)
        process.exit(1)
    }
}
export default connectDB