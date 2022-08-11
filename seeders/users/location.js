import provinces from '../data/provinces.json'
import regencies from '../data/regencies.json'
import districts from '../data/districts.json'
import villages from '../data/villages.json'
import {Provinces,Regencies,Districts,Vilages} from "@yuyuid/models";

const locationSeeder = {
    data:{
        provinces: provinces,
        regencies:regencies,
        districts:districts,
        villages:villages

    },
    initial: async ()=> {
        try{
            await Provinces.deleteMany()
            await Provinces.insertMany(locationSeeder.data.provinces)
            console.log('Locations Provinces : Data Imported');

            await Regencies.deleteMany()
            await Regencies.insertMany(locationSeeder.data.regencies)
            console.log('Locations Regencies : Data Imported');

            await Districts.deleteMany()
            await Districts.insertMany(locationSeeder.data.districts)
            console.log('Locations Districts : Data Imported');

            await Vilages.deleteMany()
            await Vilages.insertMany(locationSeeder.data.villages)
            console.log('Locations Vilages : Data Imported');
        }catch(err){

        }
    },
    destroy: async ()=> {
        try{
            await Provinces.deleteMany()
            console.log('Locations Provinces : Data Destroyed');

            await Regencies.deleteMany()
            console.log('Locations Regencies : Data Destroyed');

            await Districts.deleteMany()
            console.log('Locations Districts : Data Destroyed');

            await Vilages.deleteMany()
            console.log('Locations Vilages : Data Destroyed');
        }catch(err){

        }
    }
}
export {locationSeeder}
