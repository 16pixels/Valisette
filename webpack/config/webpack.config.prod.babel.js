/**
 * Import modules
 * @type {[type]}
 */
import ExtractTextPlugin from 'extract-text-webpack-plugin'; // warning : you should only import plugins that are used inline otherwise they're called from ./webpack/bundler.js and applied to webpack object for dependency injection
import chalk from 'chalk';
import {
  buildConfig
} from './build-config.js';
import {
  utils
} from './build-utils.js';

/**
 * Plugin declarations
 * @type {ExtractTextPlugin}
 */

const extractSassProd = new ExtractTextPlugin({
  filename: `/..${buildConfig.publicPath + buildConfig.cssPath + buildConfig.cssMain}`,
  disable: process.env.NODE_ENV === 'development',
  publicPath: buildConfig.publicPath,
  allChunks: true
});

/**
 * Constants declarations
 * @type {[type]}
 */
const sassAssets = utils.assets(`${buildConfig.scssPath + buildConfig.scssMain}`);
const EXCLUDE = /node_modules|bower_components/;

/**
 * Config object
 * @type {Object}
 */
const prodConfig = {
  entry: {
    'main': utils.assets(`${buildConfig.jsPath + buildConfig.jsMain}`)
  },
  performance: {
    hints: "warning"
  },
  devtool: buildConfig.devtool,
  target: 'web',
  output: {
    filename: `${buildConfig.jsPath}[name].js`,
    path: utils.base(buildConfig.publicPath),
    hashDigestLength: 8,
    pathinfo: true
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.json', '.scss', '.sass'],
    alias: {
      sassAssets,
      'vue$': 'vue/dist/vue.esm.js',
      '@': utils.assets(`${buildConfig.assetsPath + buildConfig.jsPath}`)
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          utils.base('node_modules'),
          utils.assets(`${buildConfig.assetsPath + buildConfig.cssPath}`)
        ],
        use: extractSassProd.extract({
          fallback: 'isomorphic-style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: false,
                sourceMap: false
              }
            },
            {
              loader: 'resolve-url-loader'
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        include: [
          utils.base('node_modules'), 
          utils.assets(`${buildConfig.scssPath}`)
        ],
        use: extractSassProd.extract({
          fallback: 'isomorphic-style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: false,
                sourceMap: false
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: false
              }
            }
          ]
        })
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        include: [utils.assets(`${buildConfig.assetsPath + buildConfig.tsPath}`)],
        use: [{
          loader: 'ts-loader'
        }]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: [
          utils.assets(`${buildConfig.assetsPath + buildConfig.jsPath}`)
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'minify'],
            plugins: ['transform-runtime']
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              use: 'css-loader?sourceMap',
              fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm
            }),
            scss: ExtractTextPlugin.extract({
              use: 'css-loader?sourceMap!sass-loader?sourceMap',
              fallback: 'vue-style-loader'
            })
          }
        }
      },
      {
        test: /\.woff$/,
        loader: 'url-loader?mimetype=application/font-woff'
      },
      {
        test: /\.ttf$/,
        loader: 'url-loader?mimetype=application/font-ttf'
      },
      {
        test: /\.eot$/,
        loader: 'url-loader?mimetype=application/font-eot'
      },
      {
        test: /\.svg$/,
        loader: 'url-loader?mimetype=iamge/svg'
      },
      {
        test: /\.png$/,
        loader: 'url-loader?mimetype=image/png'
      },
      {
        test: /\.jpg$/,
        loader: 'url-loader?mimetype=image/jpg'
      },
      {
        test: /\.gif$/,
        loader: 'url-loader?mimetype=image/gif'
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
        ]
      }
    ]
  }
};

export {
  prodConfig,
  extractSassProd
};
