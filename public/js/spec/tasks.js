define(['tasks'], function(tasks) {
	return describe('tasks', function() {

		describe('views', function() {
			describe('TaskListView', function() {

				// Setup
				beforeEach(function() {
					console.log('beforeEach! %o', this);
					this.tasks = new tasks.models.TaskList([
						{ title: 'Buy milk' },
						{ title: 'Buy eggs' },
						{ title: 'Buy flour', completed: true },
						{ title: 'Make dough', completed: true }
					]);

					// Create sandbox
					//this.sandboxEl = $('#sandbox');
					this.listView = new tasks.views.TaskListView({ collection: this.tasks });
					//this.listView.$el.appendTo('#sandbox');
				});

				// Teardown
				afterEach(function() {
					this.listView.remove();
					//this.sandboxEl.empty();
				});

				it('renders all tasks', function() {
					expect( this.listView.collection.length ).toEqual( this.tasks.length );
				});

				it('removes deleted tasks', function() {
					var currentCount = this.tasks.length;
					var firstTask = this.tasks.at(0);
					this.tasks.remove(firstTask);
					expect( this.listView.collection.length ).toEqual( currentCount - 1 );
				});

				it('hides completed tasks', function() {
					expect( this.listView.collection.active().length ).toEqual(2);
				});

			});
		});

	});
});
