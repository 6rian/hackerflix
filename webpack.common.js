const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist/dist/'),
  },
  module: {
    rules: [
      {
        // Only attempt to run babel on javascript files
        test: /\.(js)$/,
        loader: 'babel-loader',
        // Don't run babel over certain dir, files | using regex
        exclude: /node_modules/,
      },
      {
        test: /\.s?css/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './client/images',
          to: './images',
        },
      ],
    }),
  ],
};
