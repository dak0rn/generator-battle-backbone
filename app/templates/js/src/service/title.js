/**
 * Title service
 * Can be used to change the page's title
 */
define(['App'], function(App) {

	App.module('Service', function(Module, a, Backbone, Marionette, $, _) {

		Module.title = function(newTitle) {
			document.title = newTitle;
		};

		App.vent.reply('change:title', Module.title);

	});

});