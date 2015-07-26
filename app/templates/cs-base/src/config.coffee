#
# Application configuration file
#
define [], () ->
	
	# Application modules
	modules:
		# test: 'Test.Controller@test'
		# ^      ^    ^         ^--- Event to use: show:#{name}
		# ^      ^    ^      
		# ^	     ^    ^--- 'Class'
		# ^		 ^
		# ^      ^--- modules/#{name}/index
		# ^			  Must be the same as the marionette module!
		# ^
		# ^--- Base route
		'err': 'Error.Controller@error'
		home: 'Home.Controller@home'		# <--- Set your home route here
	
	routes:
		# Home route
		home: 'home'
		
		# Route for errors
		error: 'err'
	
	# Application services
	services: [
		'title',
		'navigation',
		'layout',
		'behaviors',
		'scroll'
	]
	
	routerOptions: window.__ps
	
	# Normally one wouldn't do that but we use
	# fake API here
	api: "https://api.example.org/" 
	
	languages: ['en_US']
	defaultLanguage: 'en_US'

	# Pattern that matches the language in the URL
	# Default: IETF long format, e.g. en_US or en-US
	# If you change this you have to update your localization files
	# and the language definitions above!
	languagePattern:  /^(\w\w[-_]\w\w)[/]?(.*)$/		