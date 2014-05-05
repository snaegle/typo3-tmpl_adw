var timer = require("grunt-timer");

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    timer.init(grunt, {deferLogs: false, friendlyTime: false});

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /**
         * loads various js files and concats them
         */
        concat: {
            js: {
                src: [
                    'bower_components/modernizr/modernizr.js',
                    'bower_components/fancybox/source/jquery.fancybox.js',
                    '../Resources/Private/JavaScript/plugins.js',
                    '../Resources/Private/JavaScript/script.js'
                ],
                dest: '../Resources/Public/JavaScript/production.js'
            },
            css: {
                src: [
                    'bower_components/fancybox/source/jquery.fancybox.css',
                    'bower_components/960-grid-system/code/css/960.css',
                ],
                dest: '../Resources/Private/Scss/_libs.scss'
            }
        },

        /**
         * takes a (concated) js file and uglifies it
         */
        uglify: {
            deploy: {
                src: ['../Resources/Public/JavaScript/production.js'],
                dest: '../Resources/Public/JavaScript/production.min.js',
                options: {
                    report: 'min'
                }                
            }
        },

        /**
         * compass
         */
        compass: {
            dev: {
                options: {
                    outputStyle: 'expanded',
                    noLineComments: false,
                    debugInfo: true,
                    trace: true,
                    sassDir: '../Resources/Private/Scss',
                    cssDir: '../Resources/Public/Css'
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    noLineComments: true,
                    sassDir: '../Resources/Private/Scss',
                    cssDir: '../Resources/Public/Css'
                }
            }
        },

        /**
         *
         */
        copy: {
            main: {
                expand: true,
                cwd: 'bower_components/font-awesome/fonts/',
                src: ['**'],
                dest: '../Resources/Public/Fonts/',
                filter: 'isFile'
            }
        },

        /**
         * runs compass compile with various parameters
         */
        shell: {
            preFileCleanUp: {
                command: 'rm -rf ../Resources/Public/Fonts & rm -rf .sass-cache & rm ../Resources/Public/Css/adw.css & rm -rf ../Resources/Public/JavaScript/libs & rm ../Resources/Public/JavaScript/production.js',
                options: {
                    stdout: true
                }
            },
            postFileCleanUp: {
                command: 'rm -rf ../Resources/Private/Scss/_libs.scss & rm -rf ../Resources/Public/JavaScript/libs & rm ../Resources/Public/JavaScript/production.js',
                options: {
                    stdout: true
                }
            },
            compassDeploy: {
                command: 'compass compile -c compass.rb -s compressed --time',
                options: {
                    stdout: true
                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('dev', ['shell:preFileCleanUp', 'copy', 'concat:js', 'concat:css', 'uglify', 'compass:dev', 'shell:postFileCleanUp']);
    grunt.registerTask('dist', ['shell:preFileCleanUp', 'copy', 'concat:js', 'concat:css', 'uglify', 'compass:dist', 'shell:postFileCleanUp']);
    grunt.registerTask('devCss', ['concat:css', 'compass:dev']);

};