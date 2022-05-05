export default function Pagination(query){
    try{
        let pagination = {
            page:0,
            limit:10,
            direction:"desc",
        }

        if(typeof(query?.page) !== "undefined" && query?.page !== null && query?.page !== ""){
            pagination.page = Number(query.page)
        }
        if (typeof(query?.limit) !== "undefined" && query.limit !== null && query.limit !== ""){
            pagination.limit = Number(query.limit) > 0 ? Number(query.limit) : 1
        }
        if(typeof(query.direction) !== "undefined" && query.direction !== null && query.direction !== ""){
            pagination.direction = query.direction
        }

        return {...pagination}

    }catch(err){
        return {
            page:0,
            limit:10,
            direction:"desc",
        }
    }
}
