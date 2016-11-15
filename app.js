$(function(){
	var Item = Backbone.Model.extend({
		defaults: function(){
			return {
				done: false,
				order: Items.setOrder()
			};
		},

		toggle: function(){
			this.save({done: !this.get("done")});
		}

	});


	var ItemList = Backbone.Collection.extend({
		model: Item,
		localStorage: new Backbone.LocalStorage("list-storage"),

		setOrder: function(){
			if(!this.length) return 0;
			return this.last().get("order") + 1;
		}, 

		comparator: function(model){
			return model.get("order");
		}

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
			"keypress .item-input_edit": "updateOnEnter",
			"drop": "drop"
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
		},

		drop: function(event, index){
			this.$el.trigger("updateSort", [this.model, index]);
		}

	});



	var AppView = Backbone.View.extend({
		el: $("#app"),
		collection: Items,

		events: {
			"keypress .item-input": "createOnEnter",
			"updateSort": "updateSort"
		},

		initialize: function(){

			this.sortableWrap = this.$(".item-list");

			this.sortableWrap.sortable({
				containment: "parent",
				classes: { "ui-sortable-helper": "item_move"  },
				cursor: "move",
				opacity: 0.8,
				tolerance: "pointer",

				update: function(event, ui){
					ui.item.trigger('drop', ui.item.index());
				}

			});

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
		},

		updateSort: function(event, model, position){
			this.collection.remove(model);

			this.collection.each((model, index) => {
				var order = index;
				if(index >= position){
					order += 1;
				}
				model.set('order', order);
				model.save({'order': order});
			});

			model.set('order', position);
			this.collection.add(model, {
				at: position,
				silent: true
			});
			model.save({'order': position});

		}

	});

	var App = new AppView();

	window.collection = Items;

});