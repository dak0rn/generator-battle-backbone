#
# Site's navigation
# This module is loaded by the navbar service
# 
define [
	'App'
], (App) ->

	App.module 'Navigation', (Module, a, Backbone, Marionette, $, _) ->

		class Module.Controller extends App.module('Abstract').Controller

				
			view: null

			handlers:
				onShowNavigation: ['module/Navigation/view/Navigation']

			onShowNavigation: ->

				layout = @vent.request('layout')
				@view = new Module.Navigation
				layout.getRegion('header').show @view
				@view.triggerMethod 'fade:in'
