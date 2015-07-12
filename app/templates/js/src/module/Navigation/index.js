/**
 * Site's navigation
 * This module is loaded by the navbar service
 */
define([
	'App'
], function(App) {

	App.module('Navigation', function(Module, a, Backbone, Marionette, $, _) {

		Module.Controller = App.module('Abstract').Controller.extend({

			view: null,

			handlers: {
				onShowNavigation: ['module/Navigation/view/Navigation']
			},

			onShowNavigation: function() {
				var layout = this.vent.request('layout');

				this.view = new Module.Navigation();

				layout.getRegion('header').show( this.view );

				this.view.triggerMethod('fade:in');
			}

		});

	});

});