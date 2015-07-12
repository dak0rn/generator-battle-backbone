#
# Base controller for all controllers
#
define ['App'], (App) ->
	
	App.module 'Abstract', (Module, a, Backbone, Marionette, $, _) ->
		
		class Module.Controller extends Marionette.Object
		
			# Shared event bus
			vent: Backbone.Radio.channel 'hayctrl'
			
			# An object with route handlers
			# Example:
			#
			# handlers:
			# 	  onShowDocs: [ 'module/Docs/view/DocView' ]
			# 	  	^                     ^--- resources to load
			# 	  	^
			# 	  	^--- Function to invoke
			#
			handlers: {}
			
			# Initialize function
			# Make sure sub classes invoke this one if overwritten!
			#
			initialize: ->
				handlers = _.result this, 'handlers'
				_.each handlers, (deps, funcName) =>
					deps = [] unless deps?
					func = @[funcName]
					promise = $.Deferred()
					
					return unless _.isFunction func
					
					# Overwrite original function with a surrogate
					@[funcName] = () =>
						args = Array::slice.call arguments
						require deps, () =>
							params = args.concat Array::slice.call arguments
							r = func.apply this, params

							if r?.done?
								r.done promise.resolve
							else
								promise.resolve(r)

						# Return a promise
						promise