const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require('webpack-merge');
const CompressionPlugin = require("compression-webpack-plugin");
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        mode: isDevBuild ? "development" : "production",
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
        entry: {
            'main-client': './ClientApp/boot-client.tsx'
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
                                useCache: true,
                                instance: 'at-client'
                            }
                        }
                    ]
                },
                {
                    test: /\.(css|scss)$/,
                    use: [
                        isDevBuild ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
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
            // extractCSS
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "[name].css"
                //filename: isDevBuild ? '[name].css' : '[name].[hash].css',
                // chunkFilename: isDevBuild ? '[id].css' : '[id].[hash].css',
            })
         ].concat(isDevBuild ? [
            // Plugins that apply in development builds only 
        ] : [
            // Plugins that apply in production builds only
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
        ]),
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "all"
                    },
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            }
        },
        devtool: "source-map"
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
                                useCache: true,
                                instance: 'at-server'
                            }
                        }
                    ]
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
            new webpack.NormalModuleReplacementPlugin(
                /\/iconv-loader$/, 'node-noop',
              )
        ],
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        target: 'node'
    });

    return [clientBundleConfig, serverBundleConfig];
};