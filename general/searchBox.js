// var SearchModel = Backbone.Model.extend({

// 	defaults:{
// 		autoCompleteList: [],
// 		currentVal: null,
// 	},

// });

// extend autocomplete UI to tweak functions that are not an attribute.
$.widget("q.customAutocomplete",$.ui.autocomplete,{

	_renderMenu: function( ul, items ) {
  			var that = this;
  			ul.addClass("custom-autocomplete-ul")
  			//that._renderItemData(ul,{value:"All",label:"All"});
  			$.each( items, function( index, item ) {
    			that._renderItemData( ul, item );
  				});
			},

});

var SearchView = Backbone.View.extend({



	initialize: function(){
		this.$el = $('#searchBox');
		this.minLength = 3;
		// this.url = 'http://127.0.0.1/LCB_set/server_new/desc_final'
		this.url = 'http://www.maayanlab.net/LINCS/LCBL_searchbox_server/desc_final'
		//this.listenTo(this.model,'change:autoCompleteList',this.updateList);
		// this.allTerm = '';

		//custom autocomplete UI event handler.
		var self = this;
		this.$el.customAutocomplete({
			source: this.url,
			minLength: this.minLength,
			select: function(event,ui){
				
		      // very nice function. prevent updating input with selected value
		      //right after selection
				event.preventDefault();
				var selectedTerm;
				var highlightOptions;
				if(ui.item.value=="All"){
					selectedTerm = self.allTerm;
					highlightOptions = self.currentOptions;
				}
				else{
					var id = ui.item.id;
					self.$el.val(ui.item.value);
					locatePerturbation(id);
				}

			},

			open: function(event,ui){
				self.allTerm = self.$el.val();
			},

			response: function(event,ui){
				// get dropdown list
				self.currentOptions = _.map(ui.content,function(option){
					return option.label;
				});
			},

		});
		
	},



});

var searchView = new SearchView;
var tileId;

function locatePerturbation(id){
	// clear any stuff on the page.
	clearTileInfo();

	tileId = JSON.parse("["+id+"]");
  	g_batch = tileId[0];
  	g_batchSelectIdx = tileId[0]<2?tileId[0]:tileId[0]-1;
  	g_cellType=tileId[1];
  	g_category = 0;

  	d3.select('#batchSelect').selectAll('option')
  							.filter(function(d,i){return i==g_batchSelectIdx;})
  							.attr('selected','selected');

  	

  	var batchListener = {};
  	_.extend(batchListener,Backbone.Events);

  	//'batchCatched' event happens at last line of showBatch() function.
  	//ATTENTION: the listener function has to be put before showBatch function,
  	// where the event actually happens.
  	batchListener.listenToOnce(messenger,'batchCatched',function(){
  		tiles.each(function(d,i){ if(d[2]==tileId[2]&&d[3]==tileId[3]&&d[4]==tileId[4]) showInfo2(i,this);});
  	});

  	showBatch(g_batchSelectIdx);
}
