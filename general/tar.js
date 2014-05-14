

	  var x = ljp[initialBatchIdx].x;
	  var Id = ljp[initialBatchIdx].Id;
	 var  upGenes = ljp[initialBatchIdx].upGenes;
	  var downGenes = ljp[initialBatchIdx].downGenes;
	 var conditions = ljp[initialBatchIdx].batchMap;
	 updateCellSelection(ljp[initialBatchIdx].batchMap[0].map,g_cellType);
	 
	 var w = x[g_cellType];
	 var ddf = d3.select('#batchOption').selectAll('option').filter(function(d,i){ return i ==g_batchSelectIdx;})
                                           .attr('selected','selected');
 var g_rectIdx = -1;
 var g_focused = 0; // if any tile is selected.
 var g_enrichrId;//??
 var g_category = 0;
 var g_selectedRect;//??
 // var g_batch = initialBatchIdx;
 

// up/down genes passed to enrichment analysis canvas
var uG = false;
var dG = false;
 
     var size=300;
	 
	 var margin=size/17;
	 var h_padding=63; //height of below panel
	 
     var k=Math.sqrt(w.length);//k tiles in each row and column
     var tileLength = size/k; // length of each square tiles
	 
	 var w_max=d3.max(w, function(d){return d[5];});
     var w_min=d3.min(w, function(d){return d[5];});
     
	 var svg; //??
	 var infoAreaWidth = size/3;
     var infoAreaHeight = size;		
	 var textPanel = d3.select('#info_box').append('svg')
	                                      .attr('width',infoAreaWidth)
                                          .attr('height',infoAreaHeight);
	 
	 
	 var g_contrast=1; //??
	 var avg_scale=d3.scale.pow().exponent(1).domain([0.01,1])
                                     .range(['black','red']);
	 var grid = d3.select("#grid").append("svg")
                                 .attr("width",size)
                                 .attr("height",size)
								 .attr("id",'grid')
								 .append('g');
								 
     var tiles=grid.selectAll("rect").data(w);
     tiles.enter().append("rect")
                  .attr("x",function(d,i){ return tileLength*(i%k);})
                  .attr("y",function(d,i){ return tileLength*Math.floor(i/k);})
                  .attr("width",tileLength)
                  .attr("height",tileLength)
                  .attr("fill",function(d){ return avg_scale(d[5]/w_max);})
                  .on('click',showInfo)
				  .on('mouseover',showInfoMouseOver)
				  .on('mouseout', clearInfoMouseOut);
			
	  curveBelow(g_category); 


				  
	 var range_svg; //??
	 var avg_rects; //??
	 
	function showInfoMouseOver(d,i)
	{
	   if (g_rectIdx != -1 ) return; // in clicked state
	    var cx=this.x.animVal.value;
		  var cy=this.y.animVal.value;
		   addFocusi(grid,cx,cy);
		   showTextPanelRight(this.__data__,cx,cy);   
	}
    
    function clearInfoMouseOut(d,i)
    {
	   if (g_rectIdx != -1) return; // in clicked state
	   d3.selectAll('[name=focusi]').remove();
		   d3.select('#info_rect').remove(); // remove the information rect.
		   d3.selectAll('[name=text_disp]').remove(); // remove all the elements whose name is text_disp, namely the four text lines.
		  
    }	

	 
			 
function showInfo(d,i)
{

  if(!inMultipleSelectionMode())
  	tileInfo(this,i);
  else{
  	var thisTile = d3.select(this);
	var thisx = thisTile.attr('x');
    var thisy = thisTile.attr('y');
	var thisx = parseFloat(thisx);
    var thisy = parseFloat(thisy);

    multipleSelectedTiles.push([thisx,thisy]);

    drawSelectedOutline('multipleLines',multipleSelectedTiles);

  }
}

function showInfo2(i,thispassed)
{

  tileInfo(thispassed,i);
}

function tileInfo(per_rect,idx)
      {


      	//update enrichment analyses performed count
      	

	    if(g_rectIdx == idx)
		  {
			  document.getElementById("mainCanvasSelector").checked = true;
			  console.log('here');

	      selectAlternateView("clear");
	     indicateClear(G_VAR.nodes);
	     
			 clearTileInfo();
			return;
		  }
		  clearTileInfo();
$.get('http://www.maayanlab.net/LINCS/test/execuTest/modifyEnrichCount.php');
      	console.log('h33');
		  g_rectIdx = idx;
		  
 
		  g_focused = 1;
		  g_selectedRect=per_rect;
		 var cx=per_rect.x.animVal.value;
		  var cy=per_rect.y.animVal.value;
		  
		 
   		  addFocusi(grid,cx,cy);
		  
		  tile_arr= per_rect.__data__;
		  
		 showTextPanelRight(tile_arr,cx,cy)
		/* textPanel.append('text').text('       drugs: '+conditions[2].map[tile_arr[3]])
		                    .attr('x',info_x+left_padding+'')
		                    .attr('y',info_y+bottom_padding+3*line_space+'')
		                    .attr('name','text_disp');*/
			 g_enrichrId = tile_arr[1]+'&'+tile_arr[2]+'&'+tile_arr[3]+'&'+tile_arr[4];
			 
	  updownIdx = Id.indexOf(g_enrichrId);
	 dG = downGenes[updownIdx];
	 uG = upGenes[updownIdx];

	 // add up/dn genes to the title attribute of upGenes/dnGenes radio button label
	 $('#upGenes').attr('title',uG);
	 $('#dnGenes').attr('title',dG);

	 //Note that getJSON sets upIdx and downIdx to false so that the "Up" / "Down" switch does not output an error.
	if (REGLOCK == "DOWN"){
		geneFill(G_VAR.nodes, dG, G_VAR.indicatorColor, G_VAR.infoDict, G_VAR.infos);
	} else {
		geneFill(G_VAR.nodes, uG, G_VAR.indicatorColor, G_VAR.infoDict, G_VAR.infos);
	}

	
	}
    
		  
         function clearTileInfo()
         {
		   g_rectIdx = -1;
		   g_focused = 0;
		   uG = false;
		  	dG = false;
		   d3.selectAll('[name=focusi]').remove();
		   d3.select('#info_rect').remove(); // remove the information rect.
		   d3.selectAll('[name=text_disp]').remove(); // remove all the elements whose name is text_disp, namely the four text lines.
		   d3.selectAll('[name=frozeMask]').remove();

		   

      }
	  
	var addFocusi=function (svg,cx,cy)
		    {
		
		    svg.append('rect')
			  .attr('x',cx)
              .attr('y',cy)
			  .attr("width",tileLength)
              .attr("height",tileLength)
			  .attr('fill','none')
			  .style('stroke','Azure')
			  .style('stroke-width',1.5)
			  .attr('pointer-events','none')
			  .attr('name','focusi'); 
			 }
	
	
	function showTextPanelRight(tile_arr,cx,cy)
	{
	    var info_width=size/3.1; // the width of the information rect
		   var info_height=size/6; // the height of the information rect
		   var cursor_padding=36; // the padding between the position of tile and the positon of the information rect.
		   var info_x=0;// x of information rect
		   var info_y=cy-cursor_padding; // y of information rect. So it is 36 pixels up the tile.
		   var left_padding=size/24; // The padding between the left edge of the text and the left edge of the information rect.
		   var bottom_padding=size/20; // The padding between the bottom edge of the text and the top edge of the information rect.
		    // Caution: the y of a text is where its bottom line lies, opposite to that of square.
		   var line_space=size/23; // space between texts.

		   // Adapt rect height according to length of drug name. So work out how many lines drug name occupys first.
		   drugTxt = conditions[2].map[tile_arr[3]];
		  drugTxtSplits = drugTxt.match(/.{1,18}/g);
		  baseCount = drugTxtSplits.length;

		  info_height = info_height/4*(3+baseCount);
		   if(info_y<0)info_y=0; //y of information rect must be under the topline of the main square.
		   if(info_y>size-info_height) info_y=size-info_height; // y of information rect must be above the bottom of the main square
			
		   textPanel.append('rect').attr('width',info_width)
		                     .attr('height',info_height)
							 .attr('rx',7)
							 .attr('ry',7)
							 .attr('x',info_x)
							 .attr('y',info_y)	
							 .attr('id','info_rect')
							 .attr('opacity',0.3)
							 .attr('fill','#D90000'); //set background color of the information rect.
	       // the above is to draw the information rect.
		  var drugLabelLengthMargin = conditions[2].map[tile_arr[3]].length - 13;
		  var setoff = drugLabelLengthMargin > 0 ? -drugLabelLengthMargin:0;
		  if (drugLabelLengthMargin > 7)
		  	setoff = -9;
		  
		  function addTxt(element,idx,arr)
		  {
		  	textPanel.append('text').text(element)
		                    .attr('x',info_x+left_padding+setoff*1.2+'')
		                    .attr('y',info_y+bottom_padding+idx*line_space+'')
		                    .attr('name','text_disp');
		  }
		  drugTxtSplits.forEach(addTxt);
		   
		  
		 textPanel.append('text').text(conditions[3].map[tile_arr[4]]+', '+conditions[1].map[tile_arr[2]])
		                    .attr('x',info_x+left_padding+'')
		                    .attr('y',info_y+bottom_padding+baseCount*line_space+'')
		                    .attr('name','text_disp');
		  textPanel.append('text').text('in  '+conditions[0].map[tile_arr[1]])
		                    .attr('x',info_x+left_padding+'')
		                    .attr('y',info_y+bottom_padding+(baseCount+1)*line_space+'')
		                    .attr('name','text_disp');
		}
	
	
	
    function showCategory(idx)
    {  
        
	   d3.selectAll('#nav a').filter(function(d,i){ return i==g_category;})
                              .style('text-decoration','');
	    g_category = idx;
		if (idx == 0)
		{
		d3.selectAll('[name=newlyAppended]').attr('fill',function(d,i){ var outi = i; return tiles.filter(function(d,i){ return i == outi%50;}).attr('fill');}).attr('name','');
		//above is for batch switch transition
		tiles.transition().duration(500).attr('fill',function(d){ return avg_scale(d[5]/w_max);});
		curveBelow(g_category);
		}
		else
		{
		d3.selectAll('[name=newlyAppended]').attr('fill',function(d,i){ var outi = i; return tiles.filter(function(d,i){ return i == outi%50;}).attr('fill');}).attr('name','');
		//above is for batch switch transition
		tiles.transition().duration(500) .attr('fill',function(d) { return conditions[idx].color[d[idx+1]]; });
		curveBelow(g_category);
		}
	    d3.selectAll('#nav a').filter(function(d,i){ return i==idx;})
                              .style('text-decoration','OverLine');
        
	   
    }
	
    /*function PrepareDiv()
	{
	   d3.select('#panel').remove();
	   d3.select('#base').append('div')
                      .attr('id','panel')
					  .attr('class','block');
	}*/
	
    function showCellType(i)
    {
	  clearTileInfo();
      w = x[i];
	  g_cellType = i;
      w_max=d3.max(w, function(d){return d[5];});
      w_min=d3.min(w, function(d){return d[5];});
	  k=Math.sqrt(w.length);
	  tileLength = size/k;
	  tiles = grid.selectAll("rect").data(w);
	  tiles.exit().remove();
	  tiles.enter().append('rect').attr('name','newlyAppended')
	                              .on('click',showInfo)
	                              .on('mouseover',showInfoMouseOver)
				                  .on('mouseout', clearInfoMouseOut);
	  tiles.attr("x",function(d,i){ return tileLength*(i%k);})
           .attr("y",function(d,i){ return tileLength*Math.floor(i/k);})
           .attr("width",tileLength)
           .attr("height",tileLength);
		   
	  showCategory(g_category);
	  document.getElementById("mainCanvasSelector").checked = true;
	  selectAlternateView();
	  indicateClear(G_VAR.nodes);
	  uG = false;
	  dG = false;
	  highLightDrug(0,selectedOption)
	}
	
	
	function showBatch(i)
	{
	 
	  g_batchSelectIdx = i;
	  i = i<2?i:i+1;

	 // check if ljp[i] loaded. if not, load it and re-execute showbatch(i) function.
	 if (ljp[i] == undefined)
	 {
	 	$.blockUI({ css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        } });
        d3.select('.blockMsg').select('h1').text('Waiting for server response...');

	 	var batchText = d3.select('#batchSelect').selectAll('option')
	 	              .filter(function(d,i){ return i==g_batchSelectIdx;}).text();
	
	 	var url = 'http://www.maayanlab.net/LINCS/test/mutated6/dataFetch.php?batch=' + batchText;
	 	 // var url = 'http://127.0.0.1/LCB_set/enrcryption/encrypted/dataFetch.php?batch=' + batchText;
	 	 // var url = 'http://www.maayanlab.net/LINCS/test/test2/dataFetch.php?batch=' + batchText;

		var req = new XMLHttpRequest();

	 	function transferComplete(evt)
		{
  			d3.select('.blockMsg').select('h1').text('Parsing...');
  		
  			  if(i>3)
          		eval(req.responseText);
       		  else
          		ljp[i] = JSON.parse(req.responseText);
  			
  			showBatch(g_batchSelectIdx);
  			d3.select('.blockMsg').select('h1').text('Done!');
  			$.unblockUI();
		}

		function updateProgress(evt) {
  			if (evt.lengthComputable) {
    		var percentComplete = evt.loaded / evt.total;
    		percentComplete = Math.round(percentComplete*100);
    		d3.select('.blockMsg').select('h1').text('Downloading...'+percentComplete+'%');
  			} else {
   			d3.select('.blockMsg').select('h1').text('Fail downloading...Please refreshing page...');
  			}
		}

	 	req.addEventListener("progress", updateProgress, false);
        req.addEventListener("load", transferComplete, false);
        req.open('GET',url,true);
		req.send();

	 	

	 	//$.getScript(url, function(){  $.unblockUI(); showBatch(g_batchSelectIdx);});
	 	return;
	 }
	 	
	  preCell = ljp[g_batch].batchMap[0].map[g_cellType];
	    g_batch = i;
	  currentCells = ljp[i].batchMap[0].map;
	  x = ljp[i].x;
	  Id = ljp[i].Id;
	  upGenes = ljp[i].upGenes;
	  downGenes = ljp[i].downGenes;
	 conditions = ljp[i].batchMap;
	 
	 grid.selectAll('line').remove();
	 selectedOption = 0;
	
	  if(currentCells.indexOf(preCell)!=-1)
	  {
	  	 g_cellType = currentCells.indexOf(preCell);
	  	 updateCellSelection(currentCells,g_cellType);
	  	 showCellType(g_cellType);
	   }
	  else
	  {
	    updateCellSelection(currentCells,0);
	    showCellType(0);
	    g_cellType = 0;
	  }
	  	 messenger.trigger('batchCatched');
	}

	function updateCellSelection(cellarr,selectedCell)
	{
		d3.select('#cellTypeSelect').selectAll('option').remove();
		d3.select('#cellTypeSelect').attr('onchange', 'showCellType(this.selectedIndex)')
		.selectAll('option').data(cellarr).enter()
                                  .append('option')
								  .text(function(d){return d;})
								  .attr('selected',function(d,i){if (i == selectedCell) return 'selected';});			
	 
	}
