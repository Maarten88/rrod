const isDevBuild = process.argv.indexOf('--env.prod') < 0;
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const CompressionPlugin = require("compression-webpack-plugin");
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const q = require('querystring');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const extractCSS = new ExtractTextPlugin('site.css');

    const clientIfdefOptions = {
        SERVER: false,
        "ifdef-verbose": false,        // add this for verbose output
        "ifdef-triple-slash": false    // add this to use double slash comment instead of default triple slash
    };

    const serverIfdefOptions = {
        SERVER: true
    };

    // pass as JSON object into query string ?json=...
    const clientIfdefQuery = q.encode({ json: JSON.stringify(clientIfdefOptions) });
    const serverIfdefQuery = q.encode({ json: JSON.stringify(serverIfdefOptions) });

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        stats: { modules: false },
        resolve: { extensions: [ '.js', '.jsx', '.ts', '.tsx' ] },
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
            ]
        },
        plugins: [
            new CheckerPlugin()
        ]
     });

    // Configuration for client-side bundle suitable for running in browsers
    var clientBundleOutputDir = './wwwroot/dist';
    var clientBundleConfig = merge(sharedConfig(), {
        entry:
        {
            // order is important here. We do not let aspnet-webpack-react do this for us,
            // it doesn't know where to insert it
            'main-client': [
                'core-js/shim', 
                'event-source-polyfill'
            ]
            .concat(isDevBuild ? [
                'react-hot-loader/patch'
            ] : [

            ])
            .concat([
                './ClientApp/boot-client.tsx'
            ]), // aspnet-webpack only supports a single string or array value and dynamically adds event-source-polyfill and webpack HMR
            'vendor': [
                'react-hot-loader',
                'tslib',
                'react',
                'react-dom',
                'react-bootstrap'
            ]
        },
        output: {
            path: path.join(__dirname, clientBundleOutputDir)
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    use: 'awesome-typescript-loader?silent=true&useCache=false&instance=aw-client'
                },
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    use: `ifdef-loader?${clientIfdefQuery}`
                },
                {
                    test: /\.(css|scss)$/,
                    use: extractCSS.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'postcss-loader',
                            'sass-loader'
                        ]
                    })
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: {
                        loader: 'url-loader',
                        options: { limit: 25000 }
                    }
                }, {
                    test: /(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
                    use: {
                        loader: 'url-loader',
                        options: { limit: 10000 } //?limit=100000'
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            }),
            extractCSS,
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor'],
                minChunks: Infinity
            })
         ].concat(isDevBuild ? [
            // Plugins that apply in development builds only 
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            // new webpack.optimize.OccurrenceOrderPlugin(),
            // new webpack.optimize.ModuleConcatenationPlugin(), // makes bundle smaller, but gzipped it becomes larger!
            new UglifyJSPlugin({
                output: {
                    comments: false,
                }
            }),
            new CompressionPlugin({
                asset: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$|\.css|\.svg$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
            })
        ])
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    var serverBundleConfig = merge(sharedConfig(), {
        // resolve: { mainFields: ['main'] },
        entry: {
            'main-server': './ClientApp/boot-server.tsx'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    use: 'awesome-typescript-loader?configFileName=servertsconfig.json&useCache=false&instance=aw-server'
                },
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    use: `ifdef-loader?${serverIfdefQuery}`
                },
                {
                    test: /\.json$/,
                    use: 'raw-loader'
                },
                {
                    test: /\.svg$/,
                    use: {
                        loader: 'url-loader',
                        options: { limit: 25000 } //?limit=100000'
                    }
                }
            ]
        },
        plugins: [
        ],
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        target: 'node',
        devtool: 'inline-source-map'
    });

    return [clientBundleConfig, serverBundleConfig];
};