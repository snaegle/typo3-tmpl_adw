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
            deploy: {
                src: [
                    'bower_components/modernizr/modernizr.js',
                    'bower_components/fancybox/source/jquery.fancybox.js',
                    '../Resources/Public/JavaScript/plugins.js',
                    '../Resources/Public/JavaScript/script.js'
                ],
                dest: '../Resources/Public/JavaScript/production.js'
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
                    cssDir: '../Resources/Public/Css',
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    noLineComments: true,
                    sassDir: '../Resources/Private/Scss',
                    cssDir: '../Resources/Public/Css',
                }
            }
        },

        /**
         * runs compass compile with various parameters
         */
        shell: {
            compassDeploy: {
                command: 'compass compile -c compass.rb -s compressed --time',
                options: {
                    stdout: true
                }
            },
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'shell:compassDeploy']);

};