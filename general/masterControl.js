

 var parameter = location.search;
 var hasParameter = false;
 var messenger = {};
 messenger.id = 'aa';
 _.extend(messenger,Backbone.Events);



var Counter = Backbone.Model.extend({
      defaults:{
        count: 1,
        id: 1
      },

      url: function(){
        return 'http://www.maayanlab.net/LINCS/LCB_counter_server/enrich_counter';
      }
});

$.get('http://www.maayanlab.net/LINCS/test/execuTest/getEnrichCount.php',function(data){
        currentCount = parseInt(data);
        d3.select('#searchCounter').text(currentCount.toString());
      });

setInterval(function(){$.get('http://www.maayanlab.net/LINCS/test/execuTest/getEnrichCount.php',function(data){
        currentCount = parseInt(data);
        d3.select('#searchCounter').text(currentCount.toString());
      });}, 5000);


 var ljp = [];

 if(parameter){
  hasParameter = true;
 	var tileIdStr = parameter.slice(4);
 	var tileId = JSON.parse("["+tileIdStr+"]");
 	var initialBatchIdx = tileId[0]; 
  	var g_batch = tileId[0];
  	var g_batchSelectIdx = tileId[0]<2?tileId[0]:tileId[0]-1;
  	var g_cellType=tileId[1];
  }
  else{
    hasParameter = false;
  	var initialBatchIdx = 3;
  	var g_batch = 3;
  	var g_batchSelectIdx = 2;
  	var g_cellType = 0;
  }

   $.blockUI({ css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        } });
    
	 	var batchText = d3.select('#batchSelect').selectAll('option')
	 	              .filter(function(d,i){ return i==g_batchSelectIdx;}).text();

     var url = 'http://www.maayanlab.net/LINCS/test/test2/dataFetch.php?batch=' + batchText;
    // var url = 'http://127.0.0.1/LCB_set/enrcryption/encrypted/dataFetch.php?batch=' + batchText;
	 	// var url = 'http://www.maayanlab.net/LINCS/test/mutated6/dataFetch.php?batch=' + batchText;

    // for test purpose, remove when upload to server
    // if(batchText=='LJP004')
    //   url = 'http://127.0.0.1/toServer/test/LJP004data.txt'

	 	var req = new XMLHttpRequest();

	 	function transferComplete(evt)
		{
  			d3.select('.blockMsg').select('h1').text('Parsing...');
        if(initialBatchIdx>3)
          eval(req.responseText);
        else
          ljp[initialBatchIdx] = JSON.parse(req.responseText);
         
  			d3.text('general/tar.js',function(text){
          $.globalEval(text);
          if(hasParameter)
            tiles.each(function(d,i){ if(d[2]==tileId[2]&&d[3]==tileId[3]&&d[4]==tileId[4]) showInfo2(i,this);});
        });

        
  			
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
      
      d3.select('.blockMsg').select('h1').text('Waiting for server response...');

