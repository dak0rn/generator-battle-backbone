/**
 * Application main file
 */
define([
	'marionette',
	'backbone',
	'underscore',
	'jquery',
	
	'backbone.radio'
], function(Marionette, Backbone, _, $) {

	Marionette.Application.prototype._initChannel = function() {
		this.channelName = _.result(this, 'channelName') || 'global';
		this.channel     = _.result(this, 'channel')     || Backbone.Radio.channel( this.channelName );
	};

	var Application = Marionette.Application.extend({

		vent: null,

		_loadServices: function(services) {
			var promises = [];

			// Process every service
			_.each(services, function(service) {

				// Create a promise and add it to the queue
				var promise = $.Deferred();
				promises.push( promise );

				// Load the service
				require(["service/"+service], function(s) {
					promise.resolve();
				});

			});

			// Return a promise that is resolved when all
			// other promises are resolved.
			// Since $.when does not accept an array we
			// have to use apply.
			return $.when.apply($, promises);
		},

		// Invoked when the application has been started
		onStart: function(config) {

			// Load abstract stuff
			require(['abstract/Controller','abstract/Model','abstract/Collection'], _.bind(function() {
				var servicesPromise;

				// Grab the event bus from the controller
				this.vent = this.module('Abstract').Controller.prototype.vent;

				// Expose the configuration
				this.vent.reply('config', config);

				// Load all configured services
				servicesPromise = this._loadServices( config.services );

				// Start the backbone history feature afterwards
				servicesPromise.then( _.bind(function() {
					Backbone.history.start( config.routerOptions );
					this.vent.trigger('start:app');
				}, this));

			}, this));
		}

	});

	// This module returns an instance
	return new Application();

});