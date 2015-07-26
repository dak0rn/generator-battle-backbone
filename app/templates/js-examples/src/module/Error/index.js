/**
 * Error module
 */
define(['App'], function(App) {

	App.module('Error', function(Module, a, Backbone, Marionette, $, _) {

		Module.Controller = App.module('Abstract').Controller.extend({

			handlers: {
				onShowError: ['module/Error/view/Error']
			},

			view: null,

			onShowError: function() {
				this.view = new Module.Error();

				this.vent.request('layout').getRegion('main').show( this.view );
				this.view.triggerMethod('fade:in');
			},

			onDestroyError: function() {
				var promise = $.Deferred();

				this.view.triggerMethod('fade:out', promise);

				return promise;
			}

		});

	});

});