import sharp from "sharp";
import path from "path";

export default class ResizeModule {
    constructor(props = {path: null, filename : null ,destination:null, resize: [70,50,30]}) {
        this.props = {
            ...props,
        }
        this.path = props?.path ?? null
        this.filename =  props?.filename ?? null
        this.destination = props?.destination ?? null
        this.resize = props?.resize
        return this.getInstance()
    }

    async getInstance(){
        try{
            if(this.path !== null && this.destination !== null && this.filename !== null){
                let initial = this.resize
                let data = []
                let dataActive = []
                for(let i = 0; i < initial.length; i++){
                    let fileName = await this.getFilename(this.filename,initial[i])
                    let pathFile = path.resolve(this.destination,fileName)
                    await sharp(this.path)
                        .jpeg({ quality: initial[i]})
                        .png({ quality: initial[i]})
                        .toFile(pathFile)
                        .then((result)=> {
                            if (i === 0){
                                dataActive.push({

                                    ...result,
                                    path: pathFile,
                                    destination: this.destination,
                                    filename:fileName,
                                    resize_active:[70,50,30]
                                })
                            }
                            // console.log({result})
                            data.push({
                                ...result,
                                path: pathFile,
                                destination: this.destination,
                                filename:fileName,
                                resize_active:[70,50,30]
                            })
                        })
                }
                return {
                    active: dataActive,
                    resize:data
                };
            }
        }catch(err){
            return {active:null,resize:null}
        }
    }
    async getFilename(filename = "", size = 100){
        return this.filename.split('.').join(`_${size}.`)
    }
}
