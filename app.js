$(function(){
	var Item = Backbone.Model.extend({
		default: function(){
			return {
				content: "Empty item"
			};
		}

	});



	var ItemList = Backbone.Collection.extend({
		model: Item,

		localStorage: new Backbone.LocalStorage("list-storage"),

	});



	var Items = new ItemList();



	var ItemView = Backbone.View.extend({
		tagName: "li",
		className: "item",

		template: _.template($("#item-template").html()),

		events: {
			"click .destroy": "deleteItem"
		},

		initialize: function(){
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
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

			this.listenTo(Items, 'add', this.addOne);

			Items.fetch();
		},

		addOne: function(item){
			var view = new ItemView({model: item});
			this.$("#item-list").append(view.render().el);
		},

		createOnEnter: function(e){
			if(e.keyCode != 13) return;
			if(!this.input.val()) return;

			Items.create({content: this.input.val()});
			this.input.val("");
		}
	});



	var App = new AppView();


});