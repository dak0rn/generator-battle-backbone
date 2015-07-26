#
# Home view
# 
define [
	'App',
	'text!./template/Home.html'
], (App, html) ->

	App.module 'Home', (Module, a, Backbone, Marionette, $, _) ->

		class Module.HomeView extends Marionette.ItemView

			template: _.template html

			behaviors:
				FadeBehavior: {}
				AutoLinkBehavior:
					selector: 'a'
					data: 'href'
