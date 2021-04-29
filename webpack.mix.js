// webpack.mix.js

let mix = require("laravel-mix");

mix
  .js("resources/js/script.js", "public/js/script.js")
  .sass("resources/scss/style.scss", "public/css/style.css");
