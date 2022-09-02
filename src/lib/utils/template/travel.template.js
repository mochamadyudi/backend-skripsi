import {hashUuid} from "@yuyuid/utils";

export default class TravelTemplate {
    constructor(props = {}) {
        this.fields = props?.fields
    }
    async category(){
        return {
            name: this.fields?.name ?? "uncategorized",
            slug: this.fields?.name?.toString()?.toLowerCase()?.replace(/ /g,'-') ??  "uncategorized",
            hash_id:hashUuid(),
            is_published:this.fields?.is_published ?? 0,
            is_verify:this.fields?.is_verify ?? 0,
            about:{
                title:this.fields?.about?.title ?? null,
                content: this.fields?.about?.content ?? null,
            },
            background:this.fields?.background ?? "#fff",
            date: Date()
        }
    }
}
