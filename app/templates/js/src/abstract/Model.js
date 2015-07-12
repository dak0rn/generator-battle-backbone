/**
 * Abstract model that provides easy REST integration
 */
define(['App'], function(App) {

	App.module('Abstract', function(Module, a, Backbone, Marionette, $, _) {

		Module.Model = Backbone.Model.extend({

			// Endpoint of the APi to use for this model
			endpoint: null,

			// Automatically builds the URL with the URL
			// from the configuration file
			url: function() {
				var config = App.vent.request('config');
				var endpoint = _.result(this, 'endpoint');
				var api = config.api + '/' + ( endpoint || '' );
				var id;

				if( this.isNew() )
					return api;

				id = this.get( this.idAttribute );
				return api.replace( /[^\/]$/, '$&/' ) + encodeURIComponent( id );
			}

		});

	});

});