#
# Service for scrolling
# Provides requests that allows you to scroll to
# elements or positions
# 
define ['App'], (App) ->
	App.module 'Service', (Module, a, Backbone, Marionette, $, _) ->
		
		document = $ 'html,body'
		time = 200
		
		scrollTo = (offset, time) ->
			document.animate(scrollTop:offset, time).promise()
			
		App.vent.reply 'scroll:top', (t) ->
			scrollTo 0, t or time
		
		App.vent.reply 'scroll:element', (selector, t) ->
			o = $(selector).offset()
			
			if o? and o.top?
				scrollTo o.top, t or time
			
		App.vent.reply 'scroll:offset', (offset, t) ->
			scrollTo offset, t or time
			
		App.vent.on 'route:show', -> scrollTo 0