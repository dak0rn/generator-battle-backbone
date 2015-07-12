#
# UI behaviors for Marionette views
#

define ['App'], (App) ->

	
	App.module 'Service', (Module, a, Backbone, Marionette, $, _) ->
		
		# Store for behaviors
		behaviors = Marionette.Behaviors.behaviorsLookup = {}
		
		# ========================================================= #
		
		#
		# Behavior for fading effects
		#
		class behaviors.FadeBehavior extends Marionette.Behavior

			# Default values for this behavior				
			defaults:
				duration: 200
				
			#
			# Fades the view in
			# 
			# @param	{object}	def		Thenable, resolved after the animation
			#
			onFadeIn: (def) ->
				@$el.animate opacity:1, @options.duration, def?.resolve
			
			#
			# Fades the view out
			# 
			# @param	{object}	def		Thenable, resolved after the animation
			#
			onFadeOut: (def) ->
				@$el.animate opacity:0, @options.duration, def?.resolve
				
			#
			# Hides the view when it gets rendered
			#
			onRender: ->
				@$el.css opacity:0

		#
		# Behavior that automatically makes elements clickable and routes to
		# the correct route.
		#
		class behaviors.AutoLinkBehavior extends Marionette.Behavior
			
			# Default values
			defaults:
				# jQuery selector for elements that should be clickable
				selector: '.autolink'
				# Name of the attribute that holds the URL
				data: 'data-href'
				# Name of the attribute indicating silent navigation
				silentData: 'data-silent'
				
			onRender: ->
				@$(@options.selector).on 'click', (e) =>
					e.preventDefault()
					e.stopPropagation()
					t = $(e.target)
					request = 'navigate'
					
					unless 'undefined' is typeof t.attr @options.silentData
						request = 'navigate:silent'
					
					App.vent.request request, t.attr @options.data