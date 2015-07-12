/**
 * Service for the navigation bar
 */
define(['App'], function(App) {

	App.module('Service', function(Module, a, Backbone, Marionette, $, _) {

		// We wait for the start event
		// All required services will be loaded then
		App.vent.once('start:app', function() {
			require(['module/Navigation/index'], function() {
				var ctrl = new (App.module('Navigation').Controller)();
				ctrl.triggerMethod('show:navigation');
			});
		});
	});

});