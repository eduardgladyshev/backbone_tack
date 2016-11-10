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
			if(!this.length) return 1;
			return this.last().get("order") + 1;
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
			"keypress .item-input_edit": "updateOnEnter"
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(App, 'sortEnd', this.getPosition);
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.input = this.$(".item-input_edit");
			this.$el.toggleClass("item_done", this.model.get("done"));
			this.$(".item__checkbox-done").prop("checked", this.model.get("done"));
			//this.getPosition();
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
			// Items.each((item, i) => {
			// 	item.set({order: ++i});
			// });
		},

		getPosition: function(){
			console.log(`Index: ${this.$el.index()}, content: ${this.model.get("content")}, order: ${this.model.get("order")} `);
		}

	});



	var AppView = Backbone.View.extend({
		el: $("#app"),

		events: {
			"keypress .item-input": "createOnEnter"
		},

		initialize: function(){
			var self = this;
			this.sortableWrap = this.$(".item-list");

			this.sortableWrap.sortable({
				containment: "parent",
				classes: { "ui-sortable-helper": "item_move"  },
				cursor: "move",
				opacity: 0.8,
				tolerance: "pointer",

				update: function(){
					self.a();
				}

			});

			this.input = this.$(".item-input");
			this.listenTo(Items, 'add', this.addOne);

			Items.fetch();
		},

		addOne: function(item){
			var view = new ItemView({model: item});
			this.$(".item-list").append(view.render().el);
			// Items.each((item) => {
			// 	console.log(item.get("content") + " - " + item.get("order"));
			// });
			console.log(this.sortableWrap);
		},

		createOnEnter: function(e){
			if(e.keyCode != 13) return;
			if(!this.input.val()) return;

			Items.create({content: this.input.val()});
			this.input.val("");
		}, 

		a: function(){
			Items.each((item) => {
				console.log(item.ItemView);
			});
		}

	});



	var App = new AppView();


});