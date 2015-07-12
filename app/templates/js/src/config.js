/**
 * Application configuration file
 */
define([], function() {

	return {
		// Application modules
		modules: {
			// test: 'Test.Controller@test',
			// ^      ^    ^         ^--- Event to use: show:{name}
			// ^      ^    ^      
			// ^      ^    ^--- 'Class'
			// ^	  ^
			// ^      ^--- modules/{name}/index
			// ^			  Must be the same as the marionette module!
			// ^
			// ^--- Base route
			err: 'Error.Controller@error',	// <-
			home: 'Home.Controller@home',	//  |
		},									//  |
											//  |
		routes: {							//  |
			// Home route 					//  |
			home: 'home',					//  |
											//  |
			// Route for errors 			//  |
			error: 'err'					// <-
		},

		// Application services
		services: [
			'title',
			'navigation',
			'layout',
			'behaviors',
			'navbar',
			'scroll'
		],

		routerOptions: window.__ps,

		// Fake API for this example only
		api: "https://api.example.org/",

		// Language configuration
		languages: ['en_US'],
		defaultLanguage: 'en_US',

		// Pattern that matches the language in the URL
		// Default: IETF long format, e.g. en_US or en-US
		// If you change this you have to update your localization files
		// and the language definitions above!
		languagePattern:  /^(\w\w[-_]\w\w)[/]?(.*)$/
	};
});