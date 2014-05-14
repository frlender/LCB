
function curveBelow(idx)
{   
   var below = d3.select('#below');
   below.selectAll('*').remove();
   switch(idx)
   {
      case 0:
      below.style('text-align','left').append('div').text('contrast:')
      		.style('display','inline-block').style('font-size','1.5em')
      		.style('vertical-align','35%').style('margin-right','0.5em')
      		.style('margin-left','2em');
	  below.append('form').style('display','inline-block').append('input').attr('type','range')
                           .attr('min',0.01)
                           .attr('max',4)
                           .attr('step',0.01)
                           .attr('onchange','updateContrast(this.value)');
         break;
     
     case 1:
     below.style('text-align','center');
	 drawLengend(1);
      break;  
	  
	  
     case 2:
     below.style('text-align','center')
	 below.append('div').attr('id','drugSelections')
	                    .append('select')
						.attr('id', 'drugSelect0');
			
	 
			d3.select('#drugSelect0').attr('onchange', 'highLightDrug('+0+',this.selectedIndex)')
	                              .selectAll('option').data(giveDrugOptions()).enter()
                                  .append('option')
								  .text(function(d){return d;})
								  .attr('selected',function(d,i){if (i == selectedOption) return 'selected';});			
	 	
	 		if(parseFloat(d3.select('#drugSelect0').style('width'))>290)
	 			d3.select('#drugSelect0').style('width','290px');
	 break;
	 
	 
     case 3:
     below.style('text-align','center')
     drawLengend(3);
	 break;
                           
  }
 }
 
function  updateContrast(contrast)
 {
    
	avg_scale.exponent(contrast);

	tiles.attr('fill',function(d){return avg_scale(d[5]/w_max);});
 }
 
 function drawLengend(idx)
 {  
    if(conditions[idx].color.length>10) // too many colors to draw a readable legend.
                  return;
    var backgroundHeight = size/6;
	var rectCount = conditions[idx].map.length;
	var rectWidth = size*0.7/rectCount;
    var rectHeight = size/24;
 	var rectsTx = size*0.3/2;
	var rectsTy = backgroundHeight/4-rectHeight/2;
	var axisTx = rectsTx+rectWidth/2;
	var axisTy = rectsTy + rectHeight*1.2;
	
	var below = d3.select('#below');
    var belowSvg = below.append('svg').attr('width',size)
	                                  .attr('height', backgroundHeight);
	
	 belowSvg.append('g').attr("transform","translate("+rectsTx+","+rectsTy+")")
	                     .selectAll('rect').data(conditions[idx].color).enter()
						 .append('rect')
	                     .attr('width',rectWidth)
                         .attr('height', rectHeight)
                         .attr('x',function(d,i){return i*rectWidth;})
						 .attr('fill',function(d){return d;});	
    
    var intergerRange = d3.range(0,rectCount);	
	var lengthRange = [];
	intergerRange.forEach(function(e,i,a){ lengthRange.push(e*rectWidth); });
    var scale= d3.scale.ordinal().domain(conditions[idx].map).range(lengthRange);
   var axis = d3.svg.axis().scale(scale).orient("bottom");	
     belowSvg.append('g').attr("transform","translate("+axisTx+","+axisTy+")")
                        .attr("class","axis")
	                    .call(axis)
						.selectAll('text').attr('style','font-size:7px');
						
	 if (conditions[idx].map.length>5)
	 belowSvg.selectAll('text').attr('style','font-size:6.5px');
     	
 }
 
 
// deal with case 2; drug selection

 // drug select
    
	
	var selectedOption = 0;
	var drugSelect = [];
	var drugSelectColor = ['AliceBlue  ', '#FFCE73','Turquoise','greenyellow','MediumSpringGreen', 'Violet', 'DeepPink'];
	function giveDrugOptions()
	{
	  var drugOptions = conditions[2].map.slice(0);
	  if(g_batch == 3|| g_batch == 2)
	  	   drugOptions.unshift('Ligands');
	  else
	       drugOptions.unshift('Drugs');
	   return drugOptions
	}
	function drugTiles(coordinates,data,idx)
	{
	  this.coordinates = coordinates;
	  this.data = data;
	  this.idx = idx;
	  this.clear = clear;
	  
	  function clear()
	  {
	    this.coordinates = [];
		this.data = [];
	   }
	 }
	drugSelect.push(new drugTiles([],[],[]));
	
	function highLightDrug(selectIdx,drugIdx)
	{
	  drugSelect[selectIdx].clear();
	  drawSelectedOutline('drugSelect'+selectIdx,drugSelect[selectIdx].coordinates);
	   //showTileText('drugSelect'+selectIdx,drugSelect[selectIdx].data);
	   selectedOption = drugIdx;
	  if (drugIdx==0)
	  {
	    //tiles.style('opacity',1)
        return;
		}

		
	    tiles.style('opacity','1')
		     .filter(function(d){ return d[3] == drugIdx-1;})
			 .style('opacity','1')
		     .each(fillDrugTiles);
			 
			 
	  function fillDrugTiles(d,i)
	  {
	
		 var thisTile = d3.select(this);
	     thisx = thisTile.attr('x');
		 thisy = thisTile.attr('y');
		 thisx = parseFloat(thisx);
		 thisy = parseFloat(thisy);
		 
		 drugSelect[selectIdx].coordinates.push([thisx,thisy]);
		 drugSelect[selectIdx].data.push(d);
	  }
	  
	 drawSelectedOutline('drugSelect'+selectIdx,drugSelect[selectIdx].coordinates,drugSelectColor[selectIdx]);
	 //showTileText('drugSelect'+selectIdx,drugSelect[selectIdx].data,drugSelectColor[selectIdx]);
	}
	
	// Add and Del button
	d3.select('#addDrugSelect').attr('onclick','addDrugSelect()');
	d3.select('#delDrugSelect').attr('onclick','delDrugSelect()');
	function addDrugSelect()
	{
	   addIdx = drugSelect.length;
	   if (addIdx+1 > drugSelectColor.length) return;
	   d3.select('#drugSelections').append('select')
	                              .style('display','block')
								  .attr('id','drugSelect'+addIdx)
	                              .attr('onchange', 'highLightDrug('+addIdx+',this.selectedIndex)')
	                              .selectAll('option').data(drugOptions).enter()
                                  .append('option')
								  .text(function(d){return d;});
		drugSelect.push(new drugTiles([],[],[]));
	}
	
	function delDrugSelect()
	{
	  lastIdx = drugSelect.length-1;
	  if (lastIdx == 0)
	  return;
	  highLightDrug(lastIdx,0);
	  d3.select('#drugSelections').selectAll('select')
	                              .filter(function(d,i){ return i==lastIdx;})
								  .remove();
	  drugSelect.pop();
	}
  
  
  
  function drawSelectedOutline(id,selectedCoordinates,color)
					  {
                         color = color || 'Azure';
						 var selectedOutlines = [];
						 selectedCoordinates.forEach(getOutlines);
						 var highLines = grid.selectAll('line').filter(function(d){ return d3.select(this).attr('name') == id ;});
						 highLines = highLines.data(selectedOutlines,function(d){return d;});
						 highLines.exit().remove();
						 highLines.enter().append('line').attr('x1',function(d){ return d[0];})
 														 .attr('y1',function(d){ return d[1];})
						                                 .attr('x2',function(d){ return d[2];})
														 .attr('y2',function(d){ return d[3];})
														 .attr('stroke',color)
														 .style('stroke-width',2)
														 .attr('name',id);
																			 
						     function getOutlines(e,i,a)
							 {
								var p1 = e;
								var p2 = [e[0]+tileLength,e[1]];
								var p3 = [e[0],e[1]+tileLength];
								var p4 = [e[0]+tileLength,e[1]+tileLength];
								var isOverlap = 0;
								
								var side = p1.concat(p2);
						
								selectedOutlines.forEach(annilateOverlapSides);
								if (isOverlap != 1)
								selectedOutlines.push(side);
								isOverlap = 0;
								
								side = p1.concat(p3);
								selectedOutlines.forEach(annilateOverlapSides);
								if (isOverlap != 1)
								  selectedOutlines.push(side);
								  isOverlap = 0;
								
								side = p2.concat(p4);
								selectedOutlines.forEach(annilateOverlapSides);
								if (isOverlap != 1)
								  selectedOutlines.push(side);
								  isOverlap = 0;
								
								side = p3.concat(p4);
								selectedOutlines.forEach(annilateOverlapSides);
								if (isOverlap != 1)
								  selectedOutlines.push(side);
								  isOverlap = 0;
								
								       function annilateOverlapSides(e,i,a)
									   {
									      var equ = 1;
										  e.forEach(function(em,i,a)
										  {
										    var elementEqu = em.toFixed(9) == side[i].toFixed(9);
											equ = equ&elementEqu;
											});
											
										   if( equ )
										   {
										     isOverlap = 1;
											 a.splice(i,1);
										   }
									     }
							          }
					   }
  