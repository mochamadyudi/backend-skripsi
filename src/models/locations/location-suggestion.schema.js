import mongoose from 'mongoose'


const LocationSuggestion = new mongoose.Schema({
    class: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: ""
    },
    address_components: {
        name: {
            type: String,
            default: ""
        },
        island: {
            type: String,
            default: ""
        },
        neighbourhood: {
            type: String,
            default: ""
        },
        street: {
            type: String,
            default: ""
        },
        subdistrict: {
            type: String,
            default: ""
        },
        district: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        postcode: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        },
    },
    formatted_address: {
        type: String,
        default: ""
    },
    geometry: {
        location: {
            lat: {
                type: String,
                default: ""
            },
            lng: {
                type: String,
                default: ""
            },
        },
        viewport: {
            northeast: {
                lat: {
                    type: String,
                    default: ""
                },
                lng: {
                    type: String,
                    default: ""
                }
            },
            southwest: {
                lat:{
                    type: String,
                    default: ""
                },
                lng: {
                    type: String,
                    default: ""
                }
            }
        }
    },
    osmurl: {
        type: String,
        default: ""
    },
    importance: {
        type: String,
        default: ""
    }


}, {
    timestamps: true,
    versionKey: false
});

const LocSuggestion = mongoose.model("location_suggestion", LocationSuggestion);
export {LocSuggestion}
