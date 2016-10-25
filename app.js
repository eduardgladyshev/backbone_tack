$(function(){
	var Item = Backbone.Model.extend({
		default: function(){
			return {
				content: "Empty item"
			};
		},

		initialize: function(){
			console.log("item model initialized");
		}
	});

	var ItemList = Backbone.Collection.extend({
		model: Item,

		localStorage: new Backbone.LocalStorage("list-storage"),

	});

	var Items = new ItemLIst();

	var ItemView = Backbone.Model.extend({
		tagName: "li",

		template = _.template($('#item-template').html()),

		events: {
			"click li": "deleteItem"
		},

		initialize: function(){
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){
			this.$el.html(this.template(this.model));
			return this;
		},

		deleteItem: function(){
			this.model.destroy();
		}

	});

	var AppView = Backbone.View.extend({
		el: $("#app"),

		events: {
			"keypress #new-item": "createOnEnter"
		},

		initialize: function(){
			this.input = this.$("#new-item");
		}

		createOnEnter: function(e){
			if(e.keyCode != 13) return;
			if(!this.input.val()) return;

			Items.create({content: this.input.val()});
			this.input.val("");
		}
	});


});