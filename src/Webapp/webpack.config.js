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
        CLIENT: true
    };

    const serverIfdefOptions = {
        SERVER: true,
        CLIENT: false
    };

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
            'main-client': './ClientApp/boot-client.tsx',
            'vendor': [
                'react-hot-loader',
                'tslib',
                'react',
                'react-dom',
                'react-bootstrap'
            ],
            'polyfill': [
                'core-js/shim', 
                'event-source-polyfill'
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
                    use: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: 'tsconfig.client.json',
                                silent: true,
                                useCache: false,
                                instance: 'at-client'
                            }
                        },
                        {
                            loader: 'ifdef-loader',
                            options: clientIfdefOptions
                        }
                    ] //'awesome-typescript-loader?silent=true&useCache=false&instance=at-client'
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
            new UglifyJSPlugin(),
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
        entry: {
            'main-server': './ClientApp/boot-server.tsx'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    use: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: 'tsconfig.server.json',
                                silent: true,
                                useCache: false,
                                instance: 'at-server'
                            }
                        },
                        {
                            loader: 'ifdef-loader',
                            options: serverIfdefOptions
                        }
                    ]
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