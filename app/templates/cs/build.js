/*
 * Project's static requirejs config
 * Included in the Gruntfile
 */

var fs = require('fs');

// These are the core modules
// included in the app but excluded in
// every other module
var coreModules = [
	// App configuration
	'config',
	
	// Application
	'App',
	
	// Abstracts
	'abstract/Controller',
	'abstract/Model',
	'abstract/Collection',
	
	// require.js plugins used by most of
	// the modules
	'css',
	'text',
	'i18n',
	
	// The all t
	'jquery',
	'marionette',
	'backbone',
	'backbone.radio',
	'underscore'
];

var jsFileName = (function(){

	var isJS = /(.*)\.js$/;

	return function(something) {
		var m = something.match( isJS );

		if( m && m[1] )
			return m[1];
	};

})();

/*
 * Grab all services and add them to the `coreModules`
 * array
 */
var prependService = function(s) { return 'service/'+s; };
var services = fs.readdirSync('build/service').map( jsFileName ).map( prependService );

coreModules = coreModules.concat( services );


// Modules to optimize
var targetModules = [
	/*
	 * Loader
	 * The main module that front-loads services, modules
	 * and other stuff
	 */
	{
		name: 'loader',
		
		// Things to include by default
		// Most of them are not referenced directly using
		// require.js
		include: coreModules
	}
];

/*
 * Generate a list of module to be optimized
 */
var listIncludes = function(basePath) {
	
	var mods = [];
	
	fs.readdirSync(basePath).forEach(function(file) {
		
		var target = basePath+'/'+file;
		var stats = fs.statSync(target);
		
		if( stats.isDirectory() ) {
			mods = mods.concat(listIncludes( target ));
			return;
		}
		
		filename = jsFileName(target);
		
		// Module's index.js file is listed automatically
		if( 'index.js' === file )
			return;
		
		if( filename ) {
			console.log(" +- ", filename);
			mods.push( filename );
		}
		
	});
	
	return mods;
};


process.chdir('build');
fs.readdirSync('module').forEach( function(module) {
	
	console.log('Analyzing', module);
	
	module = 'module/'+module;
	
	// Find module's dependencies
	var m = listIncludes(module);
	
	targetModules.push({
		exclude: coreModules,
		include: m,
		name: module + '/index'
	});
	
	
});
process.chdir('..');

module.exports = {
	// Project's path configuration
	paths: {
		backbone: '../node_modules/backbone/backbone-min',
		marionette: '../node_modules/backbone.marionette/lib/backbone.marionette.min',
		jquery: '../node_modules/jquery/dist/jquery.min',
		lodash: '../node_modules/lodash/index',
		'backbone.radio': '../node_modules/backbone.radio/build/backbone.radio.min',
		text: '../node_modules/requirejs-text/text',
		i18n: '../node_modules/i18n/i18n',
		'css': '../node_modules/require-css/css.min',
		'css-builder': '../node_modules/require-css/css-builder',
		'normalize': '../node_modules/require-css/normalize',
		'bootflat': '../node_modules/bootflat'
	},
	
	// Make sure everyone's using lodash
	// instead of underscore
	map: {
		'*': {
			underscore: 'lodash'
		}
	},
	
	// Source directory
	appDir: './build',
	
	// Target directory
	dir: './dist',
	
	// Base URL = 'appDir' or 'dir' respectively
	baseUrl: '.',
	
	// Uglify the code
	optimize: 'uglify2',

	// Modules to optimize
	modules: targetModules
};