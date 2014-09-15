define(['exports'], function(core) {

	core.models = {};
	core.views = {};

	core.utils = {

	};

	// Base model
	core.models.Model = Backbone.RelationalModel.extend({

	});

	// Base collection
	core.models.List = Backbone.Collection.extend({

		/**
		 * Loads the entire collection from localStorage
		 */
		load: function() {
			var self = this;
			if (this.localStorage !== undefined) {
				_.each(this.localStorage.findAll(), function(model) {
					self.add(model);
				});
			}
		},

		/**
		 * Saves the entire collection to localStorage
		 */
		save: function() {
			_.each(this.models, function(model) {
				//if (model.hasChanged())
				model.save();
			});
		}

	});

	// Base view
	core.views.View = Backbone.View.extend({

		/**
		 * Loads a template
		 *
		 * @param templatePath relative path to template file
		 * @param success function(templateText) to call after successfully loading
		 */
		loadTemplate: function(templatePath, success) {
			require(['text!../templates/' + templatePath], success);
		}

	});

	/**
	 * Helper for Knockout observables with null value defaults.
	 *
	 * Example:
	 *
	 * 		var somecollection = ko.observable().extend({ defaultIfNull: 'some default' })
	 */
	ko.extenders.defaultIfNull = function(target, defaultValue) {
		var result = ko.computed({
			read: target,
			write: function(newValue) {
				if (!newValue)
					target(defaultValue);
				else
					target(newValue);
			}
		});

		result(target());
		return result;
	}

});
