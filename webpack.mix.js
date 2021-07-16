// webpack.mix.js

let mix = require("laravel-mix");

mix
  .js("resources/js/script.js", "public/js/script.js")
  .sass("resources/scss/style.scss", "public/css/style.css");

mix.minify("public/css/style.css");
mix.minify("public/js/script.js");

mix.babelConfig({
  plugins: ["@babel/plugin-proposal-class-properties"],
});
