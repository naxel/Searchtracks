module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig(
        {
            // Configure a mochaTest task
            mochaTest: {
                test: {
                    options: {
                        reporter: 'spec',
                        timeout: 30000
                    },
                    src: ['test/vkontakte.js', 'test/**/*.js']
                }
            }
        }
    );

    grunt.registerTask('default', 'mochaTest');
};
