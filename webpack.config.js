const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production", // หรือ 'development' ตามที่คุณต้องการ
  target: "node",
  entry: "./server.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.bundle.js",
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".js", ".json"],
  },
};
