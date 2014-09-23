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
			_editing: false, // Task in edit mode?
			datetime: Date.now()
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

		DOM: function() {
			this.DOM = {
				$progress: $(".progress-warning .bar"),
				$remaining: $('.task-count-remaining'),
				$completed: $('.task-count-complete')
			};
		},

		attributes: {
			'class': 'task'
		},

		events: {
			'dblclick .title': 'onTaskDblClicked', // Task double-clicked
			'click .save-task-action': 'onSaveClicked', // Save button clicked
			'click .cancel-task-action': 'onCancelClicked', // Cancel button clicked
			'click .delete-task-action': 'deleteTask', // Trashcan / Delete clicked
			'change [name=completed]': 'onCompleteChanged' // "Completed" checkbox changed
		},

		initialize: function() {
			this.DOM();
			this.model
				.on('destroy', this.onTaskDestroyed, this)
				.on('change', this.onTaskChanged, this);
			this.render();
		},

		render: function() {
			var self = this,
					tasks = self.model.collection,
					$remaining = self.DOM.$remaining,
					$completed = self.DOM.$completed,
					inEditMode = this.model.get('_editing'),
					completedTasks = tasks.completed().length,
					isCompleted = self.model.get('completed');


			$completed.text(completedTasks);
			$remaining.text(tasks.length - completedTasks);
			self.DOM.$progress.css("width", function() {
				return (completedTasks / tasks.length * 100) + "%";
			});

			// Set CSS styling for completed task
			this.$el.toggleClass('completed', isCompleted);


			// Render template
			this.loadTemplate(
				inEditMode ? 'task_edit.html' : 'task_view.html',
				function(template) {
					self.$el.attr("title", function(){
						var dt = (new Date(self.model.get('datetime'))).toLocaleString();
						return this.title = "Last saved: "+ dt;
					});
					self.$el.html( _.template(template, self.model.attributes) );
					self.$el.attr('accesskey', String.fromCharCode(
						self.model.collection.indexOf(self.model) + 65
					));
					if (inEditMode) {
						self.$el.find("input[type=text]").focus()
					}
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
			var title = $('[name=title]', this.$el).val();
			e.preventDefault();
			if (title) {
				this.model.save({
					datetime: Date.now(),
					_editing: false,
					title: title
				});
				this.render();
			} else {
				$('#title-warning').modal();
			}
		},
		onCancelClicked: function(e) {
			e.preventDefault();
			this.model.set({ _editing: false });
			this.$el.hide();
			this.render();
		},
		onCompleteChanged: function(e) {
			var isChecked = $(e.target).is(':checked');
			this.model.save({ completed: isChecked });
		},

		// ON is antiquaited, but still apropos for the DOM
		deleteTask: function(event) {
			this.model.destroy();
			this.$el.remove();
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
			'keypress .tasks': 'editTask', // Add accessbility via accesskeys
			'click .show-intro': 'resetTaskList', // Reset tasks to show intro modal
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

		// Keyboard events
		editTask: function(event) {
			var target = $(event.target);
			return target;
		},

		// Task events
		onTaskAdded: function(task, taskList, options) {
			this.renderTask(task);
		},

		// Reset to begging
		resetTaskList: function(event) {
			this.collection.reset();
		}

	});

});
