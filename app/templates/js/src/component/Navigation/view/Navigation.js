/**
 * Navigation view
 */
define([
	'App',
	'text!./template/Navigation.html'
], function(App, html) {

	App.module('Navigation', function(Module, a, Backbone, Marionette, $, _) {

		Module.Navigation = Marionette.ItemView.extend({

			behaviors: {
				FadeBehavior: {},
				AutoLinkBehavior: {
					data: 'href',
					selector: '.link'
				}
			},

			template: _.template(html)

		});

	});

});