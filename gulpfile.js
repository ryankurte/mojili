var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');


// CONFIG
var config = {
    input: {
        bootstrap: {
            css: [
                'bower_components/bootstrap/dist/css/bootstrap.css'
            ],
            fonts: [
                'bower_components/bootstrap/dist/fonts/*'
            ],
            js: [
                'bower_components/bootstrap/dist/js/bootstrap.js'
            ]
        },
        jquery: [
            'bower_components/jquery/dist/jquery.js'
        ],
        emoji: {
            js: [
                'bower_components/emojijs/emoji.js',
            ],
            css: [
                'bower_components/emojijs/emoji.css'
            ]
        }
    },
    output: {
        scriptsFolder: 'static/scripts/lib',
        contentFolder: 'static/content/lib',
        bootstrap: {
            js: 'bootstrap-bundle.min.js',
            fontsFolder: 'static/content/fonts',
            css: 'bootstrap-bundle.min.css'
        },
        jquery: 'jquery-bundle.min.js',
        emoji: {
            js: 'emojijs-bundle.min.js',
            css: 'emojijs-bundle.min.css'
        }
    }
}


// HELPER
function genericMinifyAndBundle(options) {
    //Validation
    if (typeof options.transformationFunction === 'undefined') {
        throw new Error("No transformationFunction supplied for genericMinifyAndBundle()");
    }
    if (typeof options.src === 'undefined') {
        throw new Error("No src glob supplied for genericMinifyAndBundle()");
    }
    if (typeof options.destinationFilename === 'undefined') {
        throw new Error("No destinationFilename folder supplied for genericMinifyAndBundle()");
    }
    if (typeof options.destinationFolder === 'undefined') {
        throw new Error("No destinationFolder supplied for genericMinifyAndBundle()");
    }
    
    return gulp.src(options.src)
        .pipe(options.transformationFunction())
        .pipe(concat(options.destinationFilename))
        .pipe(gulp.dest(options.destinationFolder));
}

function jsMinifyAndBundle(options) {
    return genericMinifyAndBundle({
        transformationFunction: minify,
        src: options.src,
        destinationFilename: options.destinationFilename,
        destinationFolder: config.output.scriptsFolder
    });
}

function cssMinifyAndBundle(options) {
    return genericMinifyAndBundle({
        transformationFunction: cleanCSS,
        src: options.src,
        destinationFilename: options.destinationFilename,
        destinationFolder: config.output.contentFolder
    });
}

// BOOTSTRAP
gulp.task('bootstrap-js', [], function bootstrapJS() {
    return jsMinifyAndBundle({
        src: config.input.bootstrap.js,
        destinationFilename: config.output.bootstrap.js
    });
});

gulp.task('bootstrap-css', [], function bootstrapCSS() {
    return cssMinifyAndBundle({
        src: config.input.bootstrap.css,
        destinationFilename: config.output.bootstrap.css
    });
});

gulp.task('bootstrap-fonts', [], function bootstrapFonts() {
    return gulp.src(config.input.bootstrap.fonts)
        .pipe(gulp.dest(config.output.bootstrap.fontsFolder));
});

gulp.task('bootstrap', ['bootstrap-js', 'bootstrap-css', 'bootstrap-fonts'], function bootstrap() {
});


// JQUERY
gulp.task('jquery', [], function jquery() {
    return jsMinifyAndBundle({
        src: config.input.jquery,
        destinationFilename: config.output.jquery
    });
});


// EMOJI
gulp.task('emoji-js', [], function emojiJS() {
    return jsMinifyAndBundle({
        src: config.input.emoji.js,
        destinationFilename: config.output.emoji.js
    });
});

gulp.task('emoji-css', [], function emojiCSS() {
    return cssMinifyAndBundle({
        src: config.input.emoji.css,
        destinationFilename: config.output.emoji.css
    });
});

gulp.task('emoji', ['emoji-js', 'emoji-css'], function emoji() {
});


// GENERAL
gulp.task('scripts', ['bootstrap-js', 'jquery', 'emoji-js'], function scripts() {
});

gulp.task('content', ['bootstrap-css', 'bootstrap-fonts', 'emoji-css'], function content() {
});

gulp.task('default', ['content', 'scripts'], function gulpDefault() {
});