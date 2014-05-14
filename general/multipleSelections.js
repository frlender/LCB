var multipleSelectedTiles = [];
var inMultipleSelectionMode = function(){return d3.select('#multipleSelectionsCheckbox').property('checked');};
$('#multipleSelectionsCheckbox').change(function(){
	if(inMultipleSelectionMode()){
		clearTileInfo();
	}
	else{
		// clear multiple selection
		multipleSelectedTiles= [];
		 drawSelectedOutline('multipleLines',multipleSelectedTiles);
	}
});