/**
 * Service for scrolling
 * Provides requests that allow you to scroll to
 * elements or specific positions
 */
define(['App'], function(App) {

	App.module('Service', function(Module, a, Backbone, Marionette, $, _) {
		var document = $('html, body');
		var time = 200;

		var scrollTo = function(offset, time) {
			return document.animate({scrollTop: offset}, time).promise();
		};

		App.vent.reply('scroll:top', function(t) {
			scrollTo(0, t || time);
		});

		App.vent.reply('scroll:element', function(selector, t) {
			var o = $(selector).offset();

			if( o && o.top )
				scrollTo(o.top, t || time);
		});

		App.vent.reply('scroll:offset', function(offset, t) {
			scrollTo( offset, t || time);
		});

		// Scroll to the top of the page if the route gets changed
		App.vent.on('show:route', function() { scrollTo(0); });

	});

});