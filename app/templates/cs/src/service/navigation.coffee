# Navigation service
# Manages route changes and module loading

define ['App'], (App) ->
	
	App.module 'Service', (Module, a, Backbone, Marionette, $, _) ->
		
		vent = App.vent
		config = vent.request 'config'
		
		modules = {}
		errorRoute = config.routes.error
		homeRoute  = config.routes.home
		
		# Pattern to recognize language in the URL
		languageSplitter = config.languagePattern
						 
		# Cached replace patterns
		doubleSlashes = /\/\/+/g
		trailingSlashes = /\/*$/g
		leadingSlashes = /^\/*/g
		
		# Previous module
		previousModule = null
		
		# We store some information about the current route
		# here so that others can request them
		routeInformation =
			route: ''
			raw: ''
			sub: []
			subraw: ''
			language: config.defaultLanguage
			
		#
		# Fancy functions
		#
		
		# A function to change the route. We want to be DRY
		changeRoute = (route) ->
				Backbone.history.navigate "#{routeInformation.language}/#{route}"
		
		# Updates the user's language
		changeLanguage = (lang) ->
			routeInformation.language = lang
			
			# Configure require.js
			# Update the language config for the i18n plugin
			requirejs.config config:i18n:locale:lang
			
		# Normalizes the route
		normalize = (route) ->
			route.replace(doubleSlashes,'/').replace(trailingSlashes, '').replace leadingSlashes, ''
			
		#
		# Requests we care about
		#
		
		# Modules/Services can request "language:change" to change
		# the user's language
		vent.reply 'change:language', (lang, nextRoute) -> 
			return unless lang?
			
			# If we do not have a next route to use
			# we use the current one.
			nextRoute = routeInformation.raw unless nextRoute?
			
			changeLanguage lang
			vent.request 'navigate', nextRoute, true
			
			
		
		# Navigate without triggering any events
		# Useful for dialogs or so
		vent.reply 'navigate:silent', (where) ->
			return unless where?
			
			# Update route information manually
			where = normalize where
			parts = where.split '/'
			
			routeInformation.raw = where
			routeInformation.route = parts[0]
			
			parts = _.rest parts
			
			routeInformation.subraw = parts.join '/'
			routeInformation.sub    = parts 
			
			changeRoute where
			
		#
		# Utilities
		#
		
		# Return the current full url
		vent.reply 'location', -> window.location.href
		
		# Return the current language
		vent.reply 'language', -> routeInformation.language
		
		# Return the current route
		vent.reply 'route', -> routeInformation.route
		
		# Return the complete route information
		vent.reply 'route:info', -> _.clone routeInformation
		
		# Return the current sub route as a string
		vent.reply 'route:sub', -> routeInformation.subraw
		
		# Return the full route
		vent.reply 'route:full', -> routeInformation.raw
		
		#
		# Build a cache of modules
		#
		_.each config.modules, (handler, module) ->
			path = handler.split '@'

			unless 2 is path.length
				throw new Error "invalid handler path '#{handler}'"
				
			# Grab the first part of the module
			parts = path[0].match /^(\w+)\./
			
			# No valid module name?			
			return unless parts?
			
			# Store a handler object with all the necessary information
			modules[module] =
				moduleName: parts[1]
				event:      path[1]
				ctor:       path[0]				# Constructor fn (Marionette module)
				route:      module
				ctrl:       null				# Controller instance
				
				
		# =========================================================================================== #
				
		# Navigates to a specific route
		# The route will be splitted at slashes.
		# So, the route 'mod/sub/subsub' will trigger
		# an 'page:show:mod' event with the argument
		# ['sub','subsub'].
		#
		# A 'page:destroy:view' request will be fired where
		# 'view' is replaced with the active route. The
		# response handler for that event can return a promise
		# to perform async operations such as fading.
		#
		# @param	{string}	route			Route to navigate to
		# @param	{boolean}	forceReload		Forces a hard reload after the route has been changed
		#
		Module.navigate = (route, forceReload) ->
			
			# Grab the previous route module
			previous = previousModule
			route = _.trim route
			
			# We quit if the route did not change
			# This does not happen if the page loads the
			# first time since `previous` will be undefined then
			return if route is previous?.route and not forceReload
				
			# Is there a previous route?		
			if previous?
				# If the user presses the back button we have a previous
				# route but the route we want to navigate to begins with 
				# the language pattern.
				# In that case we extract the part after the language
				# stuff. 
				match = route.match languageSplitter
				
				if match?
					route = match[2]
			else
				# We do not have an inital route -> application has just started
				# Let's check if we have a language
				splittedRoute = Backbone.history.fragment.match languageSplitter
				routeInformation.language = null
				
				# Did we find a language?
				if splittedRoute?
					
					# Is the found language valid?
					if _.includes config.languages, splittedRoute[1]
						routeInformation.language = splittedRoute[1]
						
					# If we do not have a previous route the application
					# is booting up. Since the language was not found
					# the user might have entered an it manually.
					# We remove the language from the route because we will
					# change the brower's route below
					route = splittedRoute[2] unless previous?
				
				unless routeInformation.language?
					# No language in URL or language is invalid
					# We navigate to the default one
					routeInformation.language = config.defaultLanguage

					# Make sure the language is included in the URL
					changeRoute route
				
				changeLanguage routeInformation.language
					

			# We only try to split the target route if
			# it is not empty. If it is empty we use the
			# default route (home) internally but do not add
			# it to the URL.
			if '' is route
				baseRoute = homeRoute
				parts = []
			else
				# Remove double, trailing and leading slashes
				
				route = normalize route
				
				[ baseRoute, parts... ] = route.split '/'   # Where do we want to go?
				
				# Make sure we have an array
				parts = [] unless parts?
				
			# The promise for async operations
			promise = $.Deferred()
			modulePromise = $.Deferred()
			
			# Grab the module for the route from the
			# built module cache
			module = modules[baseRoute]
			
			# No module? Use the error module
			unless module?
				baseRoute = route = errorRoute
				module = modules[baseRoute]
				
			# Next time we navigate `previousModule` will
			# reference the current site; going one stop further
			# in the pages timeline.
			#
			# [i] We still have the previous route referenced with `previous`
			#
			previousModule = module
			
			# Load the module
			require ["module/#{module.moduleName}/index"], ->
				modulePromise.resolve module
			
			# Destroy the old view
			handler = undefined
			
			if previous?
				vent.trigger "destroy:route", routeInformation.route, routeInformation.sub, baseRoute, parts
				
				# The destroy functions can return something
				# They are passed the next route and sub route
				handler = previous.ctrl.triggerMethod "destroy:#{previous.event}", baseRoute, parts
				
			# If we got a return value it is supposed to
			# be a promise
			if handler?
				promise = handler
			else
				# We got no promise thus the promise is
				# resolved automatically
				promise.resolve()

			# Promise for callers
			routePromise = $.Deferred()
			
			# Continue after promise has been resolved
			$.when(promise,modulePromise).always =>	
				
				# Update the URL but only if we have a previous route
				# If we don't the application routes for the first
				# time and the current route is already the target
				# route.
				changeRoute route if previous?
				
				# Hard reload the page if required
				# This has to be done so that require.js loads
				# the correct language files
				if forceReload?
					window.location.reload()
					return
				
				# Create a new controller if we do not already have one.
				# This way, the module controller does not have to be reinstantiated.
				# This allows developers to write multi-page controllers without
				# re-creating views/layouts.
				unless module.ctrl?
					CtrlClass = App.module(module.ctor)
					module.ctrl = new CtrlClass
			
				# Store route information	
				routeInformation.route  = baseRoute
				routeInformation.raw    = route
				routeInformation.subraw = parts.join '/'
				routeInformation.sub    = parts
					
				# Trigger the desired event in the controller
				p = module.ctrl.triggerMethod "show:#{module.event}", parts
				
				# Trigger a global event for other handlers
				vent.trigger "show:route", baseRoute, parts

				# If the controller returned a promise we use that
				if p?.done?
					p.done routePromise.resolve
				else
					routePromise.resolve()

			# Return the route promise
			routePromise
		
		# Create the catch-all router function
		Backbone.history.handlers.push(
			route: /(.*)/
			callback: (route) =>
				Module.navigate route
		)
		
		# Make the navigate function available on the
		# event bus
		vent.reply 'navigate', Module.navigate