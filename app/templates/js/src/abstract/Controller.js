/**
 * Base controller for all controllers
 */
define(['App'], function(App) {

	App.module('Abstract', function(Module, a, Backbone,Marionette, $, _) {

		Module.Controller = Marionette.Object.extend({
			
			// Shared event bus
			vent: Backbone.Radio.channel('hayctrl'),

			// An object with route handlers
			// Example:
			//
			// handlers:
			// 	  onShowDocs: [ 'module/Docs/view/DocView' ]
			// 	  	^                     ^--- resources to load
			// 	  	^
			// 	  	^--- Function to invoke
			//
			handlers: {},

			initialize: function() {
				var handlers = _.result(this, 'handlers');

				_.each( handlers, function(deps, funcName){
					deps = deps || [];
					var func = this[funcName];
					var promise = $.Deferred();

					if( ! _.isFunction(func) )
						return;

					// Overwrite original function with a surrogate
					this[funcName] = _.bind(function() {
						var args = Array.prototype.slice.call(arguments);

						require(deps, _.bind(function() {

							var params = args.concat( Array.prototype.slice.call(arguments) );
							var r = func.apply(this, params);

							if( r && _.isFunction(r.done) )
								r.done( promise.resolve );
							else
								promise.resolve(r);

						}, this));

						return promise;
					}, this);

				}, this);

			}

		});

	});

});