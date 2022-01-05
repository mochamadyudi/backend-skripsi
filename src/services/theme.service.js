import {Cart, CartInfo, ThemeApp} from "@yuyuid/models";

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
}
