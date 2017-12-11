var isDevBuild = process.argv.indexOf('--env.prod') < 0;
var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var merge = require('webpack-merge');
var CompressionPlugin = require("compression-webpack-plugin");
//var DashboardPlugin = require('webpack-dashboard/plugin');

var allFilenamesExceptJavaScript = /\.(?!js(\?|$))([^.]+(\?|$))/;

// Configuration in common to both client-side and server-side bundles
var sharedConfig = {
    resolve: { extensions: [ '', '.js', '.ts' ] },
    output: {
        filename: '[name].js',
        publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
    },  
    module: {
        preLoaders: [
            { test: /\.json$/, loader: 'json'},
        ],
        loaders: [
            { test: /\.ts$/, include: [/ClientApp/, /node_modules/], loaders: ['ts', 'angular2-template-loader'] },
            { test: /\.html$/, loader: 'raw' },
            { test: /\.css$/, loader: 'to-string!css' },
            { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'url', query: { limit: 25000 } },
            { test: /\.properties$/, loader: 'properties-loader' }
        ]
    }
};

// Configuration for client-side bundle suitable for running in browsers
var clientBundleOutputDir = './wwwroot/dist';
var clientBundleConfig = merge(sharedConfig, {
    entry: { 'main-client': './ClientApp/boot-client.ts' },
    output: { path: path.join(__dirname, clientBundleOutputDir) },
    devtool: 'cheap-module-source-map',
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./wwwroot/dist/vendor-manifest.json')
        }),
        new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
        }),
        // new DashboardPlugin()
    ].concat(isDevBuild ? [
        // Plugins that apply in development builds only
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map', // Remove this line if you prefer inline source maps
            moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
        })
    ] : [
        // Plugins that apply in production builds only
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
        new webpack.NoErrorsPlugin(),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0
        })
    ])
});

// Configuration for server-side (prerendering) bundle suitable for running in Node
var serverBundleConfig = merge(sharedConfig, {
    entry: { 'main-server': './ClientApp/boot-server.ts' },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, './ClientApp/dist')
    },
    target: 'node',
    devtool: 'inline-source-map',
    externals: [nodeExternals({ whitelist: [allFilenamesExceptJavaScript] })] // Don't bundle .js files from node_modules
});

module.exports = [clientBundleConfig, serverBundleConfig];
