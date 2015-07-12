/**
 * Abstract collection that provides easy REST integration
 */
define(['App'], function(App) {

	App.module('Abstract', function(Module, a, Backbone, Marionette, $, _){

		Module.Collection = Backbone.Collection.extend({
			endpoint: null,
			url: function() {
				var config = App.vent.request('config');
				var endpoint = _.result(this, 'endpoint');

				return config.api + '/' + (endpoint || '');
			}
		});

	});


});