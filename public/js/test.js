requirejs.config({
	baseUrl: 'js',
	paths: {
		text: 'lib/require/text',
		domReady: 'lib/require/domReady'
	},
	waitSeconds: 30
});

require(['domReady'], function() {

	// All included specs should go in this list
	var specs = [
		'spec/core',
		'spec/tasks'
	];

	// Init Jasmine
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 1000;

	var htmlReporter = new jasmine.HtmlReporter();
	jasmineEnv.addReporter(htmlReporter);

	jasmineEnv.specFilter = function(spec) {
		return htmlReporter.specFilter(spec);
	};

	// Run each spec
	require(specs, function() {
		jasmineEnv.execute();
	});

});
