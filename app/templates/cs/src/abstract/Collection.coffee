#
# Abstract collection that provides easy REST integration
# 
define ['App'], (App) ->

	App.module 'Abstract', (Module, a, Backbone, Marionette, $, _) ->

		class Module.Collection extends Backbone.Collection

			# Endpoint of the API to use for this model
			endpoint: null
			
			# Automatically builts the URL with the URL
			# from the configuration file
			url: ->
				config = App.vent.request 'config'
				endpoint = _.result this, 'endpoint'
				"#{config.api}/#{endpoint or ''}"
