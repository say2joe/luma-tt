// RequireJS config
requirejs.config({

	baseUrl: 'js',

	waitSeconds: 30, // Seconds before async load timeout

	paths: {
		text: 'lib/require/text',
		domReady: 'lib/require/domReady',
		jquery: 'lib/jquery-ui/jquery-1.9.1',
		knockback: 'lib/knockback/knockback-full-stack',
		bootstrap: 'lib/bootstrap/bootstrap',
		d3: 'lib/d3-v2',
		jasmine: 'lib/jasmine/jasmine',
		'jasmine-html': 'lib/jasmine/jasmine-html'
	},

	shim: {
		'knockback': ['lib/knockback/backbone-relational'],
		'backbone': {
			deps: ['knockback'],
			exports: 'Backbone'
		},
		'underscore': {
			deps: ['knockback'],
			exports: '_'
		},
		'bootstrap': [
			'lib/bootstrap/bootstrap-datepicker', 
			'lib/bootstrap/bootstrap-timepicker'
		],
		'jasmine-html': {
			deps: ['jasmine'],
			exports: 'jasmine'
		}
	}

});

// Main
require(['domReady', 'tasks', 'text!initial_tasks.json'], function(domReady, tasks) {

	// Task list
	var taskList = new tasks.models.TaskList()
	taskList.load(); // Load from localStorage
	var isNewCandidate = ( taskList.length == 0 );

	if (isNewCandidate) {
		// Create seed data
		require(['text!initial_tasks.json'], function(taskData) {
			taskList.add(JSON.parse(taskData));
			taskList.save(); // Persist to localStorage
		});

		// Show intro dialog on first run
		$('#intro-dialog').modal({
			remote: 'readme.html'
		});
	}

	// Task list view
	var taskListView = new tasks.views.TaskListView({
		el: $('#task-list'),
		collection: taskList
	});

});
