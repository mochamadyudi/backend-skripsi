export function Pagination(query){
    try{
        let pagination = {
            page:0,
            limit:10,
            ordered:null,
            direction:"desc",
            orderBy:'id'
        }

        if(typeof(query?.page) !== "undefined" && query?.page !== null && query?.page !== ""){
            pagination.page = Number(query.page)
        }
        if (typeof(query?.limit) !== "undefined" && query.limit !== null && query.limit !== ""){
            pagination.limit = Number(query.limit) > 0 ? Number(query.limit) : 1
        }
        if(typeof(query.direction) !== "undefined" && query.direction !== null && query.direction !== ""){
            switch (query.direction){
                case "RAND":
                case "rand":
                case "random":
                case "RANDOM":
                case "rand()":
                case "RAND()":
                case "random()":
                case "RANDOM()":
                    pagination.direction = query?.direction
                    pagination.orderBy = null
                    pagination.ordered = [dbSql.random()]
                    break;
                default:
                    pagination.ordered = [ [pagination.orderBy,query.direction]]
                    pagination.direction = query.direction
                    break;
            }
        }

        if(typeof(query?.orderBy) !== "undefined" && query?.orderBy !== null && query?.orderBy !== "") pagination.orderBy = query?.orderBy



        return {...pagination}

    }catch(err){
        return {
            page:0,
            limit:10,
            ordered: null,
            direction:"desc",
            orderBy:'id',
            is_verified: null
        }
    }
}