/**
 * Gruntfile
 */

module.exports = function(grunt) {
	
	grunt.initConfig({
		
		/*
		 * Require.js
		 */
		requirejs: {
			compile: {
				// Will be set automatically
				options: {}
			}
		},
		
		/*
		 * Tidy up
		 */
		clean: {
			dist:  ['./dist']
		},
		
		/*
		 * Watch tasks
		 */
		watch: {
			options: {
				livereload: true,
				spawn: true
			},
			compile: {
				files: ['src/**/*.*']
			}
		},
		
		/*
		 * Built-in server
		 */
		connect: {
			server: {
				options: {
					port: 9000,
					livereload: false,
					base: '.'
				}
			}
		},

		/*
		 * Opens the user's web browser
		 */
		open: {
			dev: {
				url: 'http://localhost:<%%= connect.server.options.port %>'
			}
		}
		
	});
	
	require('load-grunt-tasks')(grunt);

	/*
	 * Loads the require.js configuration
	 * that automatically includes application modules
	 * and makes sure all dependencies are included
	 * automatically.
	 */	
	grunt.task.registerTask('generate-config', 'Update require.js configuration', function() {
		// Load the require.js configuration
		// Is built dynamically
		grunt.config.set('requirejs.compile.options', require('./build.js'));
	});
	
	// Tasks
	grunt.registerTask('build',   ['clean:dist','generate-config','requirejs:compile']);
	grunt.registerTask('default', ['connect:server','open','watch']);
};