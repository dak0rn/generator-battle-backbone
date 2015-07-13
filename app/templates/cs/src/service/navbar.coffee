#
# Service for the navigation bar
#
define ['App'], (App) ->
	
	App.module 'Service', (Module, a, Backbone, Marionette, $, _) ->
		
		# We wait for the start event
		# All required services will be loaded then
		App.vent.once 'start:app', ->
			require ["module/Navigation/index"], ->
				Controller = App.module('Navigation').Controller
				ctrl = new Controller
				ctrl.triggerMethod 'show:navigation'