define(['exports', 'core'], function(tasks, core) {

	tasks.models = {};
	tasks.views = {};

	/**
	 * Single task
	 */
	tasks.models.Task = core.models.Model.extend({

		defaults: {
			title: null,
			completed: false, // Task completed?
			_editing: false // Task in edit mode?
		},

		isVisible: function() {
			return !this.get('completed');
		}

	});

	/**
	 * List of tasks
	 */
	tasks.models.TaskList = core.models.List.extend({
		model: tasks.models.Task,
		localStorage: new Backbone.LocalStorage('myTasks'),

		/**
		 * @returns all tasks that have been completed
		 */
		completed: function() {
			return this.where({ completed: true });
		},

		// returns a list of all tasks that haven't been completed yet
		/**
		 * @returns all tasks that haven't been completed yet
		 */
		active: function() {
			return this.without.apply(this, this.completed());
		}
	});

	/**
	 * View for a single task
	 */
	tasks.views.TaskView = core.views.View.extend({

		attributes: {
			'class': 'task'
		},

		events: {
			'dblclick .title': 'onTaskDblClicked', // Task double-clicked
			'click .save-task-action': 'onSaveClicked', // Save button clicked
			'click .cancel-task-action': 'onCancelClicked', // Cancel button clicked
			'change [name=completed]': 'onCompleteChanged' // "Completed" checkbox changed
		},

		initialize: function() {
			this.model
				.on('destroy', this.onTaskDestroyed, this)
				.on('change', this.onTaskChanged, this);
			this.render();
		},
		render: function() {
			var self = this;

			// Mark as completed
			if (this.model.get('completed'))
				this.$el.addClass('completed')
			else
				this.$el.removeClass('completed');
			
			// Render template
			this.loadTemplate(
				this.model.get('_editing') ? 'task_edit.html' : 'task_view.html',
				function(template) {
					self.$el.html( _.template(template, self.model.attributes) );
				}
			);
		},

		// UI events
		onTaskDblClicked: function(e) {
			e.preventDefault();
			this.model.set({ _editing: true });
			this.render();
		},
		onSaveClicked: function(e) {
			e.preventDefault();
			this.model.save({
				title: $('[name=title]', this.$el).val(),
				_editing: false
			});
			this.render();
		},
		onCancelClicked: function(e) {
			e.preventDefault();
			this.model.set({ _editing: false });
			this.render();
		},
		onCompleteChanged: function(e) {
			var isChecked = $(e.target).is(':checked');
			this.model.save({ completed: isChecked });
		},

		// Task events
		onTaskChanged: function(task) {
			this.render();
		}
	});

	/**
	 * View for a list of tasks
	 */
	tasks.views.TaskListView = core.views.View.extend({

		attributes: {
			'class': 'tasks-container'
		},

		events: {
			'click .add-task-action': 'onAddClicked' // Add Task button clicked
		},

		initialize: function() {
			this.collection
				.on('add', this.onTaskAdded, this)
				.on('reset', function() { this.render() }, this);

			this.render();
		},

		render: function() {
			var self = this;
			this.collection.each(function(task) {
				self.renderTask(task);
			});
		},
		renderTask: function(task) {
			var taskView = new tasks.views.TaskView({ model: task });
			$('.tasks', this.el).append(taskView.el);
		},


		// UI events
		onAddClicked: function(e) {
			e.preventDefault();
			this.collection.add({ _editing: true });
		},

		// Task events
		onTaskAdded: function(task, taskList, options) {
			this.renderTask(task);
		}
	});

});
