# Layout service
# Provides a basic layout for the application
define ['App'], (App) ->

	App.module 'Service', (Module, a, Backbone, Marionette, $, _) ->
		
		class Layout extends Marionette.LayoutView
			template: _.template '<header></header><main></main><footer></footer>'
			el: 'body'
			regions:
				header: 'header'
				main:   'main'
				footer: 'footer'
				
		Module.layout = new Layout
		Module.layout.render()
		App.vent.reply 'layout', Module.layout