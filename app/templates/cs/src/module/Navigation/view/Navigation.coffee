#
# Navigation view
# 
define [
	'App',
	'text!./template/Navigation.html'
], (App, html) ->

	App.module 'Navigation', (Module, a, Backbone, Marionette, $, _) ->

		class Module.Navigation extends Marionette.ItemView

			behaviors:
				FadeBehavior: {}
				AutoLinkBehavior:
					data: 'href'
					selector: '.link'

			template: _.template html