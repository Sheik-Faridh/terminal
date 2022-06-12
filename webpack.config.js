const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { container } = require('webpack');

const deps = require('./package.json').dependencies;

const config = (env) => {
  return {
    entry: './src/index.tsx',
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'eval',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    devServer: {
      open: true,
      compress: true,
      historyApiFallback: true,
      hot: true,
      port: 3001,
      watchFiles: ['src/**/*'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.tsx', '.ts'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html',
      }),
      new container.ModuleFederationPlugin({
        name: 'term',
        filename: 'remoteEntry.js',
        exposes: {
          './Terminal': './src/components/Terminal/index.tsx',
        },
        shared: {
          react: { singleton: true, requiredVersion: deps.react, eager: true },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'], eager: true },
        },
      }),
      new MiniCssExtractPlugin(),
    ],
  };
};

module.exports = config;
