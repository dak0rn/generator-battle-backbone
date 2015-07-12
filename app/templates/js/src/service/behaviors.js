/**
 * UI behaviors for Marionette views
 */
define(['App'], function(App) {

	App.module('Service', function(Module, a, Backbone, Marionette, $, _) {

		// Store for behaviors
		var behaviors = Marionette.Behaviors.behaviorsLookup = {};

		// ========================================================= //
		

		// 
		// Behavior for fading effects
		//
		behaviors.FadeBehavior = Marionette.Behavior.extend({

			// Defaut values for this behavior
			defaults: {
				duration: 200
			},

			/**
			 * Fades the view in
			 *
			 * @param {object} def 		Thenable, resolved after the animation
			 * 
			 */
			onFadeIn: function(def) {
				this.$el.animate(
					{opacity:1},
					this.options.duration,
					( def ? def.resolve : undefined ) );
			},

			/**
			 * Fades the view ou
			 *
			 * @param {object} def 		Thenable, resolved after the animation
			 * 
			 */
			onFadeOut: function(def) {
				this.$el.animate(
					{opacity:0},
					this.options.duration,
					( def ? def.resolve : undefined ) );
			},

			// Hides the view when it gets rendered
			onRender: function() {
				this.$el.css({opacity: 0});
			}

		});

		//
		// Behavior that automatically makes elements clickable and routes to
		// the correct route.
		//
		behaviors.AutoLinkBehavior = Marionette.Behavior.extend({

			// Default values
			defaults: {

				// jQuery selector for elements that should be clickable
				selector: '.autolink',

				// Name of the attribute that holds the URL
				data: 'data-href',

				// Name of the attribute indicating silent navigation
				silentData: 'data-silent'
			},

			onRender: function() {

				var handler = _.bind(function(e){
					e.preventDefault();
					e.stopPropagation();

					var t = $(e.target);
					var request = 'navigate';

					if( 'undefined' !== typeof t.attr(this.options.silentData) )
						request = 'navigate:silent';

					App.vent.request(request, t.attr( this.options.data) );

				}, this);

				this.$( this.options.selector ).on('click', handler);

			}

		});






	});
});