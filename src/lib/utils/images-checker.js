export default class ImagesChecker{
    static async mimeType(mimetype){
        switch (mimetype) {
            case "image/png":
                return {
                    status:true,
                    extension:"png"
                }
            case "image/jpeg":
                return {
                    status:true,
                    extension:"jpeg"
                }
            case "image/jpg":
                return {
                    status:true,
                    extension:"jpg"
                }
            default:
                return {
                    status:false,
                    extension:null
                }
        }
    }

    static async Size(size = 200000){

    }
}
