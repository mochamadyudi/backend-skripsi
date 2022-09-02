module.exports = {
    "ignore": [
        "**/*.test.js"
    ],
    presets: [
        [
            require.resolve('@babel/preset-env'),
            {
                targets: {
                    node: "current",
                },
            },
        ],
    ],
    plugins: [
        // require.resolve("babel-plugin-transform-object-rest-spread"),
        require.resolve("babel-plugin-transform-export-extensions"),
        require.resolve("@babel/plugin-proposal-class-properties"),
        require.resolve("@babel/plugin-proposal-private-methods"),
        [
            require.resolve("babel-plugin-module-resolver"),
            {
                root: ["."],
                extensions: [".js"],
                alias:{
                    "@yid/controllers": "./src/controllers/index",
                    "@yuyuid/config":"./src/config/index",
                    "@yuyuid/constants": "./src/lib/constants/index",
                    "@yuyuid/core": "./src/lib/core/index",
                    "@handler": "./src/lib/handler/index",
                    "@yuyuid/handler": "./src/lib/handler/index",
                    "@yuyuid/exception": "./src/lib/exceptions/yuyuidError",
                    "@yuyuid/utils": "./src/lib/utils/index",
                    "@yuyuid/middlewares": "./src/api/middlewares/index",
                    "@yuyuid/models": "./src/models/index",
                    "@yuyuid/services": "./src/services/index",
                }
            }
        ]
    ]

}
