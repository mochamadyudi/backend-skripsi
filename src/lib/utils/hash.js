import Hashids from 'hashids'

function HashId({count = 10}){
    try{
        const hashids = new Hashids('',count || 10)
        return hashids.encode(1,2,3,4,5,6,123,151,2341,2515,123)
    }catch(err){
        return {error:true,message:err.message}
    }
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


export {HashId,makeid}
