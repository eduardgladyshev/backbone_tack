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

		deleteItem: function(){
			this.model.destroy();
		}

	});


});