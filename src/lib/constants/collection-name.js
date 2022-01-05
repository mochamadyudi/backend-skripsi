const CollectionDB = {
    /**
     * @admin_access
     */
    APP_OPTIONS: "app_options",
    LOCATION:"location",
    CATEGORY: "category",
    EVENTS_NOW: "events_now",
    EVENTS_DISCOUNT: "events_discount",
    EVENTS_BANNER: "events_banner",
    EVENTS_ALERT: "events_alert",
    EVENTS_NOTIFICATION: "event_notification",
    RATING:"ratting",
    MENU_DASHBOARD:"menu_dashboard",
    PERMISSION_MENU: "permission_menu",
    PERMISSION_ROLE: "permission_role",

    ROLES: "roles",
    ROLE_USER: "role_user",
    LOGIN_HISTORY: "login_history",


    TRAVEL: "travel",
    TRAVEL_DISCUSS:"travel_discuss",
    TRAVEL_TICKET:"travel_ticket",


    USER: "user",
    EMAIL_LOG: "email_log",
    PASSWORD_RESET: "password_reset",
    FORGOT_EMAIL: "forgot_email",
    FORGOT_PHONE_NUMBER: "forgot_phone_number",
    OTP_PHONE_NUMBER : "otp_phone_number",
    ACTIVATION: "activation",
    SETTINGS: "settings",

    VILLA: "villa",
    VILLA_PROFILES: "villa_profile",


    ROOMS: "room",
    ROOMS_SCHEDULE:"",


    CART: "cart",
    CART_INFO: "cart",
    CHECKOUT: "checkout",
    PAYMENT: "transaction",
    PAYMENT_LOG: "transaction",



    PAY_METHOD: "pay_method",
    PAY_METHOD_READY: "pay_method_ready",
}

Object.freeze(CollectionDB)


    export { CollectionDB }
