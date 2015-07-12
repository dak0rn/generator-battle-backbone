#
# Error view
# 
define [
	'App',
	'text!./template/Error.html'
], (App, html) ->

	App.module 'Error', (Module, a, Backbone, Marionette, $, _) ->

		class Module.Error extends Marionette.ItemView
			template: _.template html

			behaviors:
				FadeBehavior: {}