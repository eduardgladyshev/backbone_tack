$(function(){
	var Item = Backbone.Model.extend({
		default: function(){
			return {
				content: "Empty item",
				done: false
			};
		},

		toggle: function(){
			this.save({done: !this.get("done")});
			console.log(`save model with atribute done: ${this.get('done')}`);
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
			"click .item__checkbox-done": "toggleDone",
			"click .item__view": "edit",
			"click .button-delete": "deleteItem",
			"blur .item-input_edit": "close",
			"keypress .item-input_edit": "updateOnEnter"
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.input = this.$(".item-input_edit");
			this.$el.toggleClass("item_done", this.model.get("done"));
			this.$(".item__checkbox-done").prop("checked", this.model.get("done"));
			return this;
		},

		toggleDone: function(){
			this.model.toggle();
		},

		edit: function(){
			this.$el.addClass("item_editing");
			this.input.focus();
		},

		close: function(){
			var value = this.input.val();
			if(!value){
				this.deleteItem();
			} else{
				this.model.save({content: value});
				this.$el.removeClass("item_editing");
			}
		},

		updateOnEnter: function(e){
			if(e.keyCode == 13) {
				this.close();
			}
		},

		deleteItem: function(){
			this.model.destroy();
		}

	});



	var AppView = Backbone.View.extend({
		el: $("#app"),

		events: {
			"keypress .item-input": "createOnEnter"
		},

		initialize: function(){
			this.input = this.$(".item-input");

			this.listenTo(Items, 'add', this.addOne);

			Items.fetch();
		},

		addOne: function(item){
			var view = new ItemView({model: item});
			this.$(".item-list").append(view.render().el);
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