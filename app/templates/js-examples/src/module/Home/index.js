/**
 * Home module
 */
define(['App'], function(App) {

	App.module('Home', function(Module, a, Backbone, Marionette, $, _) {

		Module.Controller = App.module('Abstract').Controller.extend({

			handlers: {
				onShowHome: [
					'module/Home/view/Home',
					'module/Home/view/FirstSteps'
				]
			},

			view: null,

			onShowHome: function(routes) {

				// Create the correct view and update the title
				if( routes && 'first-steps' === routes[0] ) {
					this.view = new Module.FirstStepsView();
					this.vent.request('change:title','First steps');
				}
				else {
					this.view = new Module.HomeView();
					this.vent.request('change:title', 'Welcome!');
				}

				this.vent.request('layout').getRegion('main').show( this.view );
				this.view.triggerMethod('fade:in');
			},

			onDestroyHome: function() {
				var promise = $.Deferred();
				this.view.triggerMethod('fade:out', promise);
				return promise;
			}

		});


	});


});