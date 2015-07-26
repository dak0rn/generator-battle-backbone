/**
 * Battle backbone main generator file
 */
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

	_language: null,
	_examples: false,

	prompting: function() {

		var done = this.async();

		this.prompt([{
			type: 'list',
			name: 'lang',
			message: 'What language do you to use',
			choices: [
				 {
				 	name: 'JavaScript',
				 	value: 'js'
				 },
				 {
				 	name: 'CoffeeScript',
				 	value: 'cs'
				 }
			]
		},
		{
			type: 'confirm',
			name: 'examples',
			message: 'Do you want to include the examples?'
		}], function(answers) {

			this._language = answers.lang;	
			this._examples = answers.examples;	
			done();	

		}.bind(this));

	},

	writing: function() {
		this.directory(this._language, '.');

		if( ! this._examples ) {
			this.directory( this._language + '-base', '.' );
		}
		else {
			this.directory( this._language + '-examples', '.' );
		}

		
	},

	install: function() {
		this.npmInstall();
	},

	end: function() {
		console.log('Your application is ready to go!')
		console.log('Just run `grunt` to get started.')
	}


});