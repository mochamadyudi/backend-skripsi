import {Cart, CartInfo, ThemeApp} from "@yuyuid/models";
import {VillaTheme} from "../models/villa/villa_theme.schema";

export class ThemeService {
    static async SetTheme(id = null , theme = 1){
        if (id !== null){
            const themes = new ThemeApp({
                user:id,
                theme:theme
            })
            await themes.save();
        }
    }

    static async VillaSetTheme(id,theme = 1){
        if(id !== null){
            await new VillaTheme({
                villa: id,
                theme_type: theme
            }).save()
        }
    }
}
