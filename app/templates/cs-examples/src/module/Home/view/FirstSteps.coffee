#
# First steps view
# 
define [
	'App', 
	'text!./template/FirstSteps.html'
], (App, html) ->

	App.module 'Home', (Module, a, Backbone, Marionette, $, _) ->

		class Module.FirstStepsView extends Marionette.ItemView

			template: _.template html
			behaviors:
				FadeBehavior: {}