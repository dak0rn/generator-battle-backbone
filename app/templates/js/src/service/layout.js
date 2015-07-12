/**
 * Layout service
 * Provides a basic layout for the application
 */
define(['App'], function(App) {

	App.module('Service', function(Module, a, Backbone, Marionette, $, _) {

		var Layout = Marionette.LayoutView.extend({
			template: _.template('<header></header><main></main><footer></footer>'),
			el: 'body',
			regions: {
				header: 'header',
				main:   'main',
				footer: 'footer'
			}
		});

		Module.layout = new Layout();
		Module.layout.render();
		App.vent.reply('layout', Module.layout);

	});
});