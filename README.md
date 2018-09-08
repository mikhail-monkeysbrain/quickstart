# Gulp.js Sass, Pug, ES6 starter
This is a simple starter for Sass, es6, pug.

## Instructions:
	$ yarn install     -> for install pkg & dep
	$ yarn start       -> for starting livereload server
	$ yarn run build   -> create and reduce files in ./dist 

## Directories:
### <strong>Development</strong> 
<pre>
    ./src
        |_index.pug
        |_markup/
            |_blocks/
            |_elements/
            |_mixins/
        |_sass/
            |_blocks/
            |_elements/
            |_modificators/
            |_main.sass
        |_js/
            |_vendors/
        |_fonts/
        |_img/
            
</pre>

### <strong>Production</strong> 
<pre>
    ./dist
        |_index.html
        |_img/
        |_fonts/
        |_js/
            |_bundle.js  <i>// merge all files from <strong>src/js/*</strong></i>
        |_css/                                                       
            |_ main.css
</pre>
