#
#  Title service
# Can be used to change the page's title
# 
define ['App'], (App) ->
	
	App.module 'Service', (Module, a, Backbone, Marionette, $, _) ->
		
		Module.title = (newTitle) -> document.title = newTitle
		
		App.vent.reply 'change:title', Module.title
