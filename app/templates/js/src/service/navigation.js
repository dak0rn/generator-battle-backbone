/**
 * Navigation services
 * Manages route changes, module loading and
 * multi-language support
 */
define(['App'], function(App) {

	App.module('Service', function(Module, a, Backbone, Marionette, $, _) {

		var vent = App.vent;
		var config = vent.request('config');

		var modules = {};
		var errorRoute = config.routes.error;
		var homeRoute = config.routes.home;

		// Pattern to recognize the language in the URL
		var languageSplitter = config.languagePattern;

		// Cached replace patterns
		var doubleSlashes = /\/\/+/g;
		var trailingSlashes = /\/*$/g;
		var leadingSlashes = /^\/*/g;

		// Previous module
		var previousModule = null;

		// We store some information about the current
		// route here so that others can request them
		var routeInformation = {
			route: '',
			raw: '',
			sub: [],
			subraw: '',
			language: config.defaultLanguage
		};

		/*
		 * Fancy functions
		 */
		
		// A function to change the route. We want to be DRY.
		var changeRoute = function(route) {
			Backbone.history.navigate( routeInformation.language + '/' + route );
		};

		// Updates the user's language
		var changeLanguage = function(lang) {
			routeInformation.language = lang;

			// Configure require.js
			// Update the language config for the i18n plugin
			requirejs.config({
				config: {
					locale: lang
				}
			});

		};

		// Normalizes the route
		var normalize = function(route) {
			return route.replace(doubleSlashes,'/')
						.replace(trailingSlashes, '')
						.replace(leadingSlashes,'');
		};

		/*
		 * Requests we care about
		 */
		
		// Modules/Services can request "change:language"
		// to change the user's language
		vent.reply('change:language', function(lang, nextRoute) {
			if( null === lang || 'undefined' === typeof lang )
				return;

			// If we do not have a next route to use
			// we use the current one.
			if( null === nextRoute || 'undefined' === typeof nextRoute )
				nextRoute = routeInformation.raw;

			changeLanguage(lang);
			vent.request('navigate', nextRoute, true);
		});

		// Navigate without triggering any events
		// Useful for dialogs or so
		vent.reply('navigate:silent', function(where) {
			if( null === where || 'undefined' === typeof where )
				return;

			where = normalize(where);
			var parts = where.split('/');

			routeInformation.raw = where;
			routeInformation.route = parts[0];

			parts = _.rest(parts);

			routeInformation.subraw = parts.join('/');
			routeInformation.sub    = parts;

			changeRoute(where);
		});

		/*
		 * Utilities
		 */
		
		// Return the current full URL
		vent.reply('location', function() {
			return window.location.href;
		});

		// Return the current language
		vent.reply('language', function() {
			return routeInformation.language;
		});

		// Return the current route
		vent.reply('route', function() {
			return routeInformation.route;
		});

		// Return the complete route information
		vent.reply('route:info', function(){
			return _.clone( routeInformation );
		});

		// Return the current sub route as a string
		vent.reply('route:sub', function() {
			return routeInformation.subraw;
		});

		// Return the full route
		vent.reply('route:full', function() {
			return routeInformation.raw;
		});

		/*
		 * Build a cache of modules
		 */
		_.each( config.modules, function(handler, module) {

			var path = handler.split('@');

			if( 2 !== path.length )
				throw new Error("invalid handler path '" + handler + "'");

			// Grab the first part of the module
			var parts = path[0].match(/^(\w+)\./);

			// No valid module name?
			if( null === parts )
				return;

			modules[ module ] = {
				moduleName: parts[1],
				event:      path[1],
				ctor:       path[0],		// Constructor fn
				route:      module,
				ctrl:       null			// Controller instance
			};

		});

		// =========================================================================================== //
		
		// Navigates to a specific route
		// The route will be splitted at slashes.
		// So, the route 'mod/sub/subsub' will trigger
		// an 'page:show:mod' event with the argument
		// ['sub','subsub'].
		//
		// A 'page:destroy:view' request will be fired where
		// 'view' is replaced with the active route. The
		// response handler for that event can return a promise
		// to perform async operations such as fading.
		//
		// @param	{string}	route			Route to navigate to
		// @param	{boolean}	forceReload		Forces a hard reload after the route has been changed
		//
		Module.navigate = function(route, forceReload) {
			// Grab the previous route module
			var previous = previousModule;
			route = _.trim(route);

			var baseRoute = null;
			var parts = [];

			var tmp;

			var promise;
			var modulePromise;
			var routePromise;

			var module;
			var handler;

			// We quit if the route did not change
			// This does not happen if the page loads
			// the first time since `previous` will be
			// undefined then
			if( previous !== null && 
				previous.route === route &&
				! forceReload )
				return;

			// Is there a previous route?
			if( null !== previous ) {
				// If the user presses the back button we have a previous
				// route but the route we want to navigate to begins with 
				// the language pattern.
				// In that case we extract the part after the language
				// stuff.
				var match = route.match( languageSplitter );

				if( null !== match )
					route = match[2];

			}
			else {

				// We do not have an initial route -> application has just started
				// Let's check if we have a language
				var splittedRoute = Backbone.history.fragment.match( languageSplitter );
				routeInformation.language = null;

				// Did we find a language?
				if( null !== splittedRoute ) {

					// Is the found language valid?
					if( _.includes(config.languages, splittedRoute[1]) )
						routeInformation.language = splittedRoute[1];

					// If we do not have a previous route the application
					// is booting up. Since the language was not found
					// the user might have entered an it manually.
					// We remove the language from the route because we will
					// change the brower's route below
					route = splittedRoute[2];
				}

				if( null === routeInformation.language ) {
					// No language in URL or language is invalid
					// We navigate to the default one
					routeInformation.language = config.defaultLanguage;

					// Make sure the language is included in the URL
					changeRoute(route);
				}

				changeLanguage(routeInformation.language);
			}

			// We only try to split the target route if it is
			// not empty. If it is empty we use the default route
			// (home) internally but do not add
			// it to the URL.
			if( '' === route ) {
				baseRoute = homeRoute
				// parts = []
			}
			else {
				// Remove slashes
				route = normalize(route);

				tmp = route.split('/');

				if( _.isArray(tmp) ) {
					baseRoute = tmp[0];
					parts = _.rest(tmp);
				}

			}

			// The promise for async operations
			promise = $.Deferred();
			modulePromise = $.Deferred();

			// Grab the module for the route from the
			// built module cache
			module = modules[ baseRoute ];

			// No module? Use the error module
			if( null ===  module || 'undefined' === typeof module ) {
				baseRoute = route = errorRoute;
				module = modules[baseRoute];
			}

			// Next time we navigate `previousModule` will
			// reference the current site; going one stop further
			// in the pages timeline.
			//
			// [i] We still have the previous route referenced with `previous`
			//
			previousModule = module;

			// Load the module
			require(['module/' + module.moduleName + '/index'], function() {
				modulePromise.resolve( module );
			});

			// Destroy the old view
			if( null !== previous && 'undefined' !== typeof previous ) {
				vent.trigger('destroy:route',
								routeInformation.route,
								routeInformation.sub,
								baseRoute,
								parts);

				// The destroy functions can return something
				// They are passed to the next route and sub route
				handler = previous.ctrl.triggerMethod('destroy:'+previous.event, baseRoute, parts);
			}

			// If we got a return value it is supposed to
			// be a promise
			if( handler )
				promise = handler;
			else
				// We got no promise thus the promise is
				// resolved automatically
				promise.resolve();

			// Promise for callers
			routePromise = $.Deferred();

			// Continue after promises have been resolved
			$.when( promise, modulePromise ).always( _.bind(function(){

				// Update the URL but only if we have a previous route
				// If we don't the application routes for the first
				// time and the current route is already the target
				// route.
				if( null !== previous && 'undefined' !== typeof previous )
					changeRoute( route );

				// Hard reload the page if required
				// This has to be done so that require.js loads
				// the correct language files
				if( forceReload ) {
					window.location.reload();
					return;
				}

				// Create a new controller if we do not already have one.
				// This way, the module controller does not have to be reinstantiated.
				// This allows developers to write multi-page controllers without
				// re-creating views/layouts.
				if( ! module.ctrl ) {
					module.ctrl = new ( App.module(module.ctor) )();
				}

				// Store route information
				routeInformation.route  = baseRoute;
				routeInformation.raw    = route;
				routeInformation.subraw = parts.join('/');
				routeInformation.sub    = parts;

				// Trigger the desired event in the controller
				p = module.ctrl.triggerMethod('show:'+module.event, parts);

				// Trigger a global event for other handlers
				vent.trigger('show:route', baseRoute, parts);

				// If the controller returned a promise we use that
				if( p && _.isFunction(p.done) )
					p.done( routePromise.resolve );
				else
					routePromise.resolve();

			}, this));

			// Return the route promise
			return routePromise;

		};

		// Create the catch-all router function
		Backbone.history.handlers.push({
			route: /(.*)/,
			callback: function(route) { Module.navigate(route); }
		});

		// Make the navigate function available on the
		// event bus
		vent.reply('navigate', Module.navigate);

	});
});