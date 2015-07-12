#
# Application's loader file
# Configures require.js and front loads some required
# dependencies.
#

requirejs.config(
	paths:
		backbone: '../node_modules/backbone/backbone'
		marionette: '../node_modules/backbone.marionette/lib/backbone.marionette'
		jquery: '../node_modules/jquery/dist/jquery'
		lodash: '../node_modules/lodash/index'
		'backbone.radio': '../node_modules/backbone.radio/build/backbone.radio'
		text: '../node_modules/requirejs-text/text'
		css: '../node_modules/require-css/css'
		i18n: '../node_modules/i18n/i18n'
			
	map:
		'*':
			underscore: 'lodash'
)

require [
	'App',
	'config',

	# Load CSS files and jQuery plugins here
	'css!../main.css'
	
], (app, config) ->
	app.start(config)