#
# Error module
# 
define ['App'], (App) ->

	App.module 'Error', (Module, a, Backbone, Marionette, $, _)  ->

		class Module.Controller extends App.module('Abstract').Controller

			handlers:
				onShowError: ['module/Error/view/Error']

			view: null

			onShowError: ->
				@view = new Module.Error

				@vent.request('layout').getRegion('main').show @view
				@view.triggerMethod 'fade:in'

			onDestroyError: ->
				promise = $.Deferred()

				@view.triggerMethod 'fade:out', promise

				promise