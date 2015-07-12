#
# Abstract model that provides easy REST integration
# 
define ['App'], (App) ->

	App.module 'Abstract', (Module, a, Backbone, Marionette, $, _) ->

		class Module.Model extends Backbone.Model

			# Endpoint of the API to use for this model
			endpoint: null
			
			# Automatically builds the URL with the URL
			# from the configuration file
			url: ->
				config = App.vent.request 'config'
				endpoint = _.result this, 'endpoint'
				api = "#{config.api}/#{endpoint or ''}"

				if @isNew()
					return api

				id = @get @idAttribute
				api.replace(/[^\/]$/, '$&/') + encodeURIComponent(id)