// Builder for Mutt

const webpack = require('webpack')

module.exports = [
    {
        entry: './src/standalone.js',
        output: {
            path: './dist',
            filename: 'mutt.js',
            library: ['Mutt'],
            libraryTarget: 'var'
        },
        module: {
            loaders: [{
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel',
            }]
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                // Introspection prevents mangling
                mangle: false, 
                compress: {
                    warnings: false
                }
            })
        ]
    }
]