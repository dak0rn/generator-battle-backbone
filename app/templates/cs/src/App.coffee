#
# Application main file
#
define [
	'marionette',
	'backbone',
	'underscore',
	'jquery',
	
	'backbone.radio'
], (Marionette, Backbone, _, $) ->

	# Patch Backbone.Radio and remove Backbone.Wreqr	
	Marionette.Application::_initChannel = () ->
		@channelName = _.result(this, 'channelName') or 'global'
		@channel     = _.result(this, 'channel') or Backbone.Radio.channel @channelName
	
	# Application class
	class Application extends Marionette.Application
	
		vent: null
		
		_loadServices: (services) ->
			promises = []
			
			# Process every service
			for service in services
				# Avoid closure scope problems
				do (service) =>
					# Create a promise and add it to the
					# queue
					promise = $.Deferred()
					promises.push promise
					
					# Load the service
					require ["service/#{service}"], (s) =>
						# Pass the application object and resolve the
						# promise
						promise.resolve()
			
			# Return a promise that is resolved when all
			# other promises are resolved.
			# Since $.when does not accept an array we
			# have to use apply.			
			$.when.apply $, promises

		# Invoken when the application has been started
		onStart: (config) ->
			
			# Load the abstract controller
			require ['abstract/Controller','abstract/Model','abstract/Collection'], =>
				
				# Grab the event bus from the controller
				@vent = @module('Abstract').Controller::vent
				
				@vent.reply 'config', config
				
				# Load all configured services
				servicesPromise = @_loadServices config.services
				
				# Start the backbone history feature afterwards
				servicesPromise.then =>
					Backbone.history.start(config.routerOptions)
					@vent.trigger "start:app" 
				


	# This module returns an instance	
	new Application