/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        compass: {
            clean: {
                options: {
                    clean: true
                }
            },
            dev: {
                options: {
                    sassDir: ['Sass'],
                    cssDir: ['CSS'],
                    environment: 'development',
                    force: true
                }
            },
            prod: {
                options: {
                    sassDir: ['sass'],
                    cssDir: ['css'],
                    environment: 'production',
                    force: true
                }
            }
        },
        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['compass:dev']
            }
        },

        concat: {
            css: {
                src: ['css/**/*.css'],
                dest: 'css/styles.css'
            }
        },

        cssmin: {
            css: {
                src: 'css/styles.css',
                dest: 'css/styles.min.css'
            }
        }
    });

    // Load the plugin that provides the tasks we need
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('default', []);
    grunt.registerTask('build', ['compass:dev']);
    grunt.registerTask('default', ['watch']);

    // Build task(s).
    grunt.registerTask('build:css', ['concat:css', 'cssmin:css']);
};
