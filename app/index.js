/**
 * Battle backbone main generator file
 */
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

	_language: null,

	prompting: function() {

		var done = this.async();

		this.prompt({
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
		}, function(answers) {

			this._language = answers.lang;		
			done();	

		}.bind(this));

	},

	writing: function() {
		this.directory(this._language, '.');
	},

	install: function() {
		this.npmInstall();
	},

	end: function() {
		console.log('Your application is ready to go!')
		console.log('Just run `grunt` to get started.')
	}


});