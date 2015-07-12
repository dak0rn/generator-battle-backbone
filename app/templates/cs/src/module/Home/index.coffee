#
# Home module
#
define ['App'], (App) ->

	App.module 'Home', (Module, a, Backbone, Marionette, $, _) ->

		class Module.Controller extends App.module('Abstract').Controller

			handlers:
				onShowHome: [
					'module/Home/view/Home',
					'module/Home/view/FirstSteps'
				]

			view: null

			onShowHome: (routes) ->

				if 'first-steps' is routes?[0]
					@view = new Module.FirstStepsView
					@vent.request 'change:title', 'First steps'
				else
					@view = new Module.HomeView
					@vent.request 'change:title', 'Welcome!'

				@vent.request('layout').getRegion('main').show @view
				@view.triggerMethod 'fade:in'

			onDestroyHome: ->
				promise = $.Deferred()
				@view.triggerMethod 'fade:out', promise
				promise