export const validator = ({error, _}, res,next) => {
    if(error){
        res.send(error)
    }
    next()
};
