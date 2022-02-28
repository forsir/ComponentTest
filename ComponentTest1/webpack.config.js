const path = require('path');

module.exports = {
    devtool: "source-map",
    entry: {
        home: './Scripts/app.ts',
    },
    mode: 'production',
    optimization: {
        minimize: false,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, '/wwwroot/scripts')
    }
};
