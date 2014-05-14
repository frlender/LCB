	
	
	function initializeIt(json){

			var weights = json['weights'];
			var textArray = json['texts'];

			// Main function.	
			G_VAR = {	
						names: textArray,
						nodes: [],  // nodes Container
						width: Math.sqrt(weights.length),
						canvasSize: 300,
						scale: 1,
						canvasRGB : [0, 255, 255],
						indicatorColor: [255, 255, 255],
						avgWeight : 0,
						scaleZoom: 1,
						translateZoom: [0,0], 
						infoDict: {},
						infos: {},
						randomArray: [],
						lockView: false
					}

			for (var i = 0; i < weights.length; i++){
				var node = new NodeObj(i, weights[i], textArray[i]);
				G_VAR.avgWeight += weights[i] / weights.length / 8;
				G_VAR.nodes.push(node);
			}			
			return G_VAR;
		}

		function infoDictMaker(infos){
			// Creates a dictionary from the GMT Files inputted
			// The dictionary counts how many times an element appears in the file.
			infoDict = {};
			for (var line in infos){
				elements = infos[line];
				for (var i = 0; i < elements.length; i++){
					if (elements[i].toUpperCase() in infoDict){
						infoDict[elements[i].toUpperCase()] += 1;
					} else {
						infoDict[elements[i].toUpperCase()] = 1;
					} 
				}
			}

			return infoDict;
		}
		

		
		
	function clearTextArea(textArea){
		// Clears the textArea upon first click.
		// Will not clear after the first click.

		textArea.value = "";
		textArea.onfocus = "";
	}

	
	//--------------------------
	// Create Name Array + Choose Random Genes
	//--------------------------



	function exampleRandom(infos, randomArray, x){
		// Generates a random set of genes from the infoArray file.
		// The default number of genes is set to 20 and can be modified
		// in the HTML File.
		var count = 0;
		var wait = self.setInterval(function(){
				
				if (isEmpty(G_VAR.infos) == false){
					clearInterval(wait);
					infos = G_VAR.infos;
					if (randomArray == false){
						var u = createUniqueArray(infos)    //u[0] = randomDict, u[1] = randomArray
						randomArray = u[1];
						G_VAR.randomArray = randomArray;
					}
						for (var i = 1; i <=x ; i++){
							q = Math.floor(Math.random() * randomArray.length)
							swap = randomArray[randomArray.length - i];
							randomArray[randomArray.length - i] = randomArray[q];
							randomArray[q] = swap;
						}

						document.getElementById("genes").value = randomArray.slice(randomArray.length - x).join('\n');
						document.getElementById("genes").onfocus = "";
					
					
					
					
				} else {
					pleaseWait(count, "genes", "value");
					count += 1;
				}										
			} , 100);
	}
	

	function pleaseWait(count, target, attribute){
		if (count%4 == 0){
			dots =" ";
		} else if (count%4 == 1 ) {
			dots = " .";
		} else if (count%4 == 2) { 
			dots = " . .";
		} else {
			dots = " . . .";
		}
		
		if (attribute == "value"){
			document.getElementById(target).value = "Getting GMT File. Please wait" + dots; 
		} else if (attribute == "innerHTML") {
			document.getElementById(target).innerHTML = "Getting GMT File. Please wait" + dots; 
		}
	}
	//--------------------------
	// Bright Color Wheel
	//--------------------------

	function colorWheel(pixels, target, modify, startColor){
		// Generates the bright color wheel as darker colors are not that useful
		// on the canvas. 
		var sqrt3 = Math.sqrt(3);
		
		var rows = [
			[[0, 255, 255], [51, 204, 255], [51, 153, 255], [102, 153, 255]],
			[[102, 255, 204], [102, 255, 255], [102, 204, 255], [153, 204, 255], [153, 153, 255]],
			[[102, 255, 153], [153, 255, 204], [204, 255, 255], [204, 204, 255], [204, 153, 255], [204, 102, 255]],
			[[102, 255, 102], [153, 255, 153], [204, 255, 204], [255, 255, 255], [255, 204, 255], [255, 153, 255], [255, 102, 255]],
			[[153, 255, 102], [204, 255, 153], [255, 255, 204], [255, 204, 204], [255, 153, 204], [255, 102, 204]],
			[[204, 255, 102], [255, 255, 153], [255, 204, 153], [255, 153, 153], [255, 102, 153]],
			[[255, 255, 102], [255, 204, 102], [255, 153, 102], [255, 102, 102]]
			]
		var svg = d3.select(target).append("svg:svg").attr("height", 7 * pixels * sqrt3).attr("width", 7 * pixels * sqrt3);
		var mid = Math.floor(rows.length/2);

		for (var r = 0; r < rows.length; r++){
			var shift = Math.abs(mid - r);
			for (var hex = 0; hex < rows[r].length; hex++){
				var columnOrigin = sqrt3 * shift / 2 * pixels + hex * sqrt3 * pixels
				var rowOrigin = pixels / 2 + ((r+1) * 1.5 * pixels);
				var up = pixels/2;
				var right = sqrt3*pixels/2;
				var path = ["M", columnOrigin, rowOrigin, 
							"l", right, up, 
							"l",  right, -up, 
							"l", 0, -pixels,  
							"l", -right, -up,  
							"l", -right, up, "Z"].join(" ");

				aPath = svg.append("svg:path").attr("d", path)
					.attr("modify", modify)
					.attr("target", target)
					.attr("value", rows[r][hex])
					.style("fill", ["rgb(", rows[r][hex].join(","), ")"].join(""))
					.on("click", colorCanvas);
					
				if (rows[r][hex].join(",") === startColor.join(",")){
			
					aPath.attr("stroke-width", 2)
						 .attr("stroke", "black");
				}
			}
		}
	}
	

	function colorCanvas(){
		// Colors the canvas depending on what was selected on the color wheel.
		// Note that FireFox treats color information in the form of RGB(r,g,b),
		// not by hexcode.

		d3.select(this.getAttribute("target")).selectAll("path").style("stroke", "none");
		//console.log(this.style.fill);
		this.style.stroke = "#666"
		this.style.strokeWidth = 2;

		canvasRGB = this.getAttribute("value").split(",");

	

		if (this.getAttribute("modify") === "G_VAR.canvasRGB"){

			G_VAR.canvasRGB = canvasRGB;

				for (var i = 0; i < G_VAR.nodes.length; i++){
					G_VAR.nodes[i].colorizer(G_VAR.scale, canvasRGB);
				}
				canvas.selectAll("rect").remove();
				canvas.selectAll("circle").remove();
				rectMake(G_VAR.nodes, G_VAR.canvasSize / Math.sqrt(G_VAR.nodes.length));
				circleMake(G_VAR.nodes, G_VAR.canvasSize / Math.sqrt(G_VAR.nodes.length));
		} else if (this.getAttribute("modify") === "G_VAR.indicatorColor"){
			G_VAR.indicatorColor = canvasRGB;

		}

	}
	function selectAlternateView(option){
	
		if (document.getElementById("mainCanvasSelector").checked){

			console.log(option);
			if(option!="clear")
			lastView = "mainCanvasSelector";

			document.getElementById("chartContainer").style.display = "none";
			document.getElementById("svgContainer").style.display="block";
			document.getElementById("pvalueContainer").style.display="none"
			document.getElementById("selectionDisplay4").style.display="none";
			d3.select("#enrichBelow").style('display','none');
			if ($("#NetworkView").empty() == false){
				document.getElementById("NetworkView").style.display="none";
			}
			
			if (d3.select("#pvalueSVG").empty() == false){
				document.getElementById("pvalueSVG").style.display="none";
			}
			
			
			document.getElementById("mainSVG").style.display="inline";

		
		
		} else if (document.getElementById("networkView").checked){
			
			lastView = "networkView";
			document.getElementById("chartContainer").style.display = "block";
			document.getElementById("svgContainer").style.display="none";
			document.getElementById("pvalueContainer").style.display="none"
			document.getElementById("selectionDisplay4").style.display="none";
			d3.select("#enrichBelow").style('display','none');
			document.getElementById("NetworkView").style.display="inline";
			document.getElementById("pvalueSVG").style.display="none";
			document.getElementById("mainSVG").style.display="none";
			d3.select("a.toggleChart").text("Click to View Canvas")


	
		
		} else if (document.getElementById("pvalueCanvas").checked){
			
			lastView = "pvalueCanvas";
			document.getElementById("chartContainer").style.display = "none";
			document.getElementById("svgContainer").style.display="none";
			document.getElementById("pvalueContainer").style.display="block";
			document.getElementById("selectionDisplay4").style.display="none";
			document.getElementById("NetworkView").style.display="none";
			document.getElementById("mainSVG").style.display="inline";
			document.getElementById("pvalueSVG").style.display="inline";
			d3.select("#enrichBelow").style('display','block');

		
		} else if (document.getElementById("showTable").checked){
			
			lastView = "showTable";
			document.getElementById("chartContainer").style.display = "none";
			document.getElementById("svgContainer").style.display="none";
			document.getElementById("pvalueContainer").style.display="none";
			document.getElementById("selectionDisplay4").style.display="block";
			document.getElementById("NetworkView").style.display="none";
			document.getElementById("mainSVG").style.display="inline";
			document.getElementById("pvalueSVG").style.display="inline";
			d3.select("#enrichBelow").style('display','none');
		
		
		
		}
	}
	
	function pvalueCanvas(nodeList){
		
		var pvalueSVG = d3.select("#pvalueContainer")
							.append("svg:svg")
							.attr("id", "pvalueSVG")
							.attr("width", 300)
							.attr("height", 300)
							.on("mousedown", find);
		var min = nodeList[0][1]
		var max = nodeList[nodeList.length - 1][1]
		var nodeNames = [];
		var nodeDict = {};
		var nodes = G_VAR.nodes;
		var indicate = G_VAR.indicatorColor;
		var width = Math.sqrt(G_VAR.nodes.length);
		var pixels = 300 / width; 
		for (var i = 0; i < nodeList.length; i++) { 
			nodeDict[nodeList[i][0].toUpperCase()] = parseFloat(nodeList[i][1]);
			nodeNames.push(nodeList[i][0].toUpperCase())

		}
		rectGroup = pvalueSVG.selectAll("rect");
		
		
		for (var i = 0; i < nodes.length; i++){
				
				var node = nodes[i];
				rec = rectGroup.data([node]).enter().append("svg:rect");
				rec.attr("x", function(d){ return d.index%width * pixels;})
							.attr("y", function(d) { return Math.floor(d.index/width) * pixels;})
							.attr("width", pixels)
							.attr("height", pixels)
				rec.append("title")
			        .text(function(d) { return d.text; });
				
				if (nodeNames.indexOf(G_VAR.nodes[i].searchText) > -1){
					var oriNum = []
					for (var x=0; x<3; x++){
						oriNum.push(Math.floor(indicate[x] * (0.4 + 0.6 * (1 - (nodeDict[G_VAR.nodes[i].searchText] - min) / (max - min)))));
						//console.log((1 - (nodeDict[G_VAR.nodes[i].searchText] - min) / (max - min)));
					}
					rec.attr("fill", ["rgb(", oriNum.join(","), ")"].join(""));
					//console.log(["rgb(", oriNum.join(","), ")"].join(""))

				} else {
					rec.attr("fill", "rgb(0,0,0)")
				}
				
		}


		document.getElementById("pvalueCanvas").disabled = false;

		// draw pvalue legend
		var legendLength = size*0.6;
      var legendRange = _.map(nodeList,function(item){return parseFloat(item[1]);});
      var rectWidth = legendLength/legendRange.length;
       var backgroundHeight = size/6;
    var rectHeight = size/24;
 	var rectsTx = 0;
	var rectsTy = backgroundHeight/4-rectHeight/2;
	var axisTx = rectsTx;
	var axisTy = rectsTy + rectHeight*1.2;
	var below = d3.select("#enrichBelow").style('display','none');
	below.append('div').attr('class','avgZscore').text('p value:');
      var belowSvg = below.append('svg').attr('width',240)
      				     				.attr('height',50)
      				     				.style('margin-left','0.8em');
      				     				// .style('background-color','black');
      belowSvg.append('g').attr('transform',"translate("+rectsTx+","+rectsTy+")")
      				   .selectAll('rect').data(legendRange).enter()
      				   .append('rect')
      				   .attr('width',rectWidth)
      				   .attr('height',size/24)
      				   .attr('x',function(d,i){return i*rectWidth;})
      				   .attr('fill',function(d){
      				   		var oriNumBase = Math.floor(255*(0.4+0.6*(1-(d-min)/(max-min))));
      				   		return "rgb("+oriNumBase+','+oriNumBase+','+oriNumBase+")";});

      var intergerRange = [legendRange[0],legendRange[legendRange.length-1]];	
	var lengthRange = [];
	intergerRange.forEach(function(e,i,a){ lengthRange.push(i*legendLength/(intergerRange.length-1)); });
    var scale= d3.scale.ordinal().domain(intergerRange).range(lengthRange);
   var axis = d3.svg.axis().scale(scale).orient("bottom");	
     belowSvg.append('g').attr("transform","translate("+axisTx+","+axisTy+")")
                        .attr("class","axis")
	                    .call(axis)
						.selectAll('text').attr('style','font-size:8px');

			
	}
			


	//--------------------------
	// Download Link 
	//--------------------------


		function downloadLink(){
			// Allows downloading and printing of the current canvas view
			var selector;
			
			
			if (document.getElementById("mainCanvasSelector").checked){
				selector = "svg#mainSVG";			
			} else if (document.getElementById("networkView").checked){
				selector = "svg#NetworkView";
			} else if (document.getElementById("pvalueCanvas").checked){
				selector = "svg#pvalueSVG";
			}
			
	        var html = d3.select(selector).attr("xmlns", "http://www.w3.org/2000/svg").node()
				.parentNode.innerHTML;
			var newWindow=window.open("data:image/svg+xml;base64,"+ btoa(html), " ", 'location=yes');
			newWindow.print();
		}
		
	//--------------------------
	// get from server
	//--------------------------		
		
		function createXMLhttp(){
			var xmlhttp;
			if (window.XMLHttpRequest) {
			  	xmlhttp=new XMLHttpRequest();
			} else {
			  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			return xmlhttp;
		}
		
		function createTextFile(string){
			// Creates a temporary text file by using XMLHttpRequest to send information
			// back to the server. The filename is generated by using the date and a small
			// random tag appended to the end of it. 
			//
			// It then generates a link for download asynchronously. 

			var xmlhttp = createXMLhttp();
			var d=new Date();
			random = d.getTime().toString().slice(2)+ Math.floor(Math.random() * 1000).toString();
			
			xmlhttp.open("POST","createFile.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("random="+random+"&string="+string)

			xmlhttp.onreadystatechange=function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					d3.select("#selectionDisplay3").append("div").attr("id", "textdownload")
							.style("width", "390px")
							.style("padding-top", "15px")
					.append("a").attr("id", "textdownload")
					.attr("href", "downloadTextFile.php?q=" + random)
					.text("Click Here to Download Full Node/P-Value Table");
				}
			}
		}
		
		
			
		
	function getJSON(i, canvasRGB, indicatorColor){
			// Gets the canvas JSON file from server synchronously. 
			// Calls getGMT to get the information for the canvas. 
			
			
			//GET CANVAS

			

			var number = document.getElementById("selectCanvas").options[i].value;
			
			if (number == "x"){
				return;
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

		d3.select('.blockMsg').select('h1').text('Waiting for server response...');

				d3.selectAll(".manhattan").remove();
				d3.select("#mainSVG").remove();
				$("#NetworkView").remove();
				d3.selectAll("#pvalueSVG").remove();
				d3.selectAll("#textdownload").remove();
				d3.selectAll("#toggleChart").remove();
				d3.selectAll(".GSE").remove();
				
				document.getElementById("mainCanvasSelector").checked = "checked";
				document.getElementById("networkView").disabled = true;
				document.getElementById("pvalueCanvas").disabled = true;
				document.getElementById("chartContainer").style.display = "none";
				document.getElementById("pvalueContainer").style.display="none"
				
			
			var xmlhttp = createXMLhttp();

			url = 'http://www.maayanlab.net/LINCS/test/Chris_vis/';
			xmlhttp.open("GET",url+"getJSON_byQiaonan.php?number="+number, false);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send();			

			if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
				getGMT(i);

				var json = JSON.parse(xmlhttp.responseText);
				
				
				G_VAR = initializeIt(json);
				G_VAR.canvasRGB = canvasRGB; //canvasRGB
				G_VAR.indicatorColor = indicatorColor; //indicatorColor
				G_VAR.scale = Math.log(0.25)/Math.log(G_VAR.avgWeight);
				for (var j = 0; j < G_VAR.nodes.length; j++){
						G_VAR.nodes[j].colorizer(G_VAR.scale, G_VAR.canvasRGB);
					}
				visualizeIt(G_VAR);
				document.getElementById("svgContainer").style.display="block";
				document.getElementById("mainSVG").style.display="inline";
				//uG = false;
				//dG = false;
				//document.getElementById('colorScale').innerHTML = 0.25;
				//document.getElementById('range_colorScale').value = 0.25;
				// getGMT(i);

			}
			
			else { 
				getJSON(i, canvasRGB, indicatorColor);
			}
		}
	
	function getGMT(i){
			//Get GMT
			var number = document.getElementById("selectCanvas").options[i].value;
			
			if (number == "x"){
				return;
			}

			
			if (number == "24"){
				//Note. used because the GMT is too big for PHP to handle.
				d3.json("../Transfac_GMT_dict.json", function(data){
					
					G_VAR.infos=data;
					if(g_focused==1) showSigTerms();
					$.unblockUI();
				});
				
				return;
			};
			// url = 'http://www.maayanlab.net/LINCS/test/test2/';
			// url = 'http://127.0.0.1/LCB_set/enrcryption/encrypted/'
			url = 'http://www.maayanlab.net/LINCS/test/Chris_vis/';
			document.getElementById("selectCanvas").disabled = "disabled";
			var xmlhttp = createXMLhttp();
			xmlhttp.open("GET",url+"getGMT_byQiaonan.php?number=" + number, true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send();
			
			xmlhttp.onreadystatechange=function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200){

					$.unblockUI();

					G_VAR.infos = JSON.parse(xmlhttp.responseText.toUpperCase());
					document.getElementById("selectCanvas").disabled = "";

					if(g_focused==1) showSigTerms();
				}	
				
				else if ( xmlhttp.readyState == 4 && xmlhttp.status == 500){
				
					getGMT(i);
				}
			}

	}
	
	//-----------------------------
	// Selection Options
	//-----------------------------


		function indicateClear(nodes){
			// Clears all circles from the current SVG View by making their opacity 0.
			// Transitions included to make circle removal smooth.
			// Removes all analysis outputs and switches any toggle back to the canvas.
			d3.select("#nodeTable_gene").remove();
			d3.select("#results_gene").remove();
			d3.selectAll(".GSE").remove();
			d3.select("div#manhattan").remove();
			d3.select("svg#pvalueSVG").remove();
			d3.select("#enrichBelow").selectAll("*").remove();

			document.getElementById("mainCanvasSelector").checked = "checked";
			document.getElementById("networkView").disabled = true;
			document.getElementById("pvalueCanvas").disabled = true;
			document.getElementById("showTable").disabled = true;
			document.getElementById("chartContainer").style.display = "none"; 
			document.getElementById("pvalueContainer").style.display= "none"


			
			document.getElementById("mainSVG").style.display = "inline";
			document.getElementById("svgContainer").style.display="block";
			/*
			d3.selectAll("#NetworkView").remove();
			d3.selectAll("#textdownload").remove();
			d3.selectAll("#toggleChart").remove();
			*/
			

			for (var i = 0; i < nodes.length; i++){
					nodes[i].circleClear();
					}
			canvas.selectAll("circle")
					.attr("r",1e-5)
				.remove();
		}

	//-------------------------------------
	// Manhattan Distance Calculation
	//-------------------------------------

		function fill(nodes, elements, RGB, width){
			// Fill creates an array of indicated values using delimiter "\n", 
			// and calls circleMake to create the indicator circles.
			
			var elementList = elements.toUpperCase().split("\n");			
			var manhattanNodes = [];
			var checkIndex = {};    // Prevents nodes from being indicated more than once per fill

				for (var i in nodes){
					if (elementList.indexOf(nodes[i].searchText) > -1 && !(i in checkIndex)){
						nodes[i].circleMaker(RGB, 1);
						manhattanNodes.push(nodes[i])
						checkIndex[i] = i;
					}
				}
			canvas.selectAll("circle").remove();
			circleMake(nodes, 300 / width);

		}	
		
		
	function findDistance(x1, y1, x2, y2, width){
			with (Math){
				xdiff = (2 * abs(x2 - x1) <= width) ? abs(x2 - x1) : width - abs(x2 - x1);
				ydiff = (2 * abs(y2 - y1) <= width) ? abs(y2 - y1) : width - abs(y2 - y1);
				distance = xdiff + ydiff;
				}
			return distance;
		}
		
		function manhattanDistance(nodes, width){
			// Calculates the shortest manhattan distance between all selected nodes.
			// As the canvas is a torus, this function will select for the smallest
			// distance between two nodes using this criteria.
			// Afterwards, the sum of all interactions are averaged together to get
			// the average manhattan distance between all nodes.
			
			var combination = 0, totalDistance = 0, x1 = 0, x2 = 0, y1 = 0, y2 = 0,
				avgDistance = 0, stdev = 0; xdiff = 0; ydiff= 0, distanceArr = [],
				numerator = 0;


			for (var i = (nodes.length - 1); i >= 0; i--){
				x1 = nodes[i].index%width;
				y1 = Math.floor(nodes[i].index/width);

				for (var c = (i - 1); c >= 0; c--){
					x2 = nodes[c].index%width;
					y2 = Math.floor(nodes[c].index/width);
					
					distance = findDistance(x1, y1, x2, y2, width);

					distanceArr.push(distance)
					totalDistance += (distance)
					combination += 1
				}
			}


			avgDistance = totalDistance / combination;
			for (var i = 0; i < distanceArr.length; i++){
				numerator += Math.pow(distanceArr[i] - avgDistance, 2);
			}

			stdev = Math.sqrt(numerator/(combination-1));
			var nodeOutput = [avgDistance, stdev];

			return nodeOutput;
		}

	function getElements(string){
	
			var xmlhttp = createXMLhttp();
			
			xmlhttp.open("POST","propToDrug.php", false);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("prop=" + string);			

			var json = JSON.parse(xmlhttp.responseText);
			document.getElementById("elementTerm").value = json.join("\n");
	
	}
	
	function clusterFind(elementList, nodes, width){
			// Calculate the z-score using the average Nearest Neighbor distance.
			// Note that "nodes" are the selected nodes. 
			// 
			// If there is only one node selected, the clusterFind function will
			// output a really large positive z-score. The more negative the z-score,
			// the greater the clusering. 
			// 
			// The algorithm's creator is Neil Clark.
			var x1, x2, x2, y2, 
				totalSum, distance, nearestDist, 
				avgNN, m, z

			if (nodes.length < 3){
				return "N/A";
			}

			totalSum = 0;

			for (var chosen = 0; chosen < nodes.length; chosen++){
				nearestDist = 9999;
				x1 = nodes[chosen].index%width;
				y1 = Math.floor(nodes[chosen].index/width);
				for (var i = 0; i < nodes.length; i++){
					if (i !== chosen){
						x2 = nodes[i].index%width;
						y2 = Math.floor(nodes[i].index/width);
						distance = findDistance(x1, y1, x2, y2, width);
						
						if (nearestDist > distance){
							nearestDist = distance;
							if (nearestDist == 1){
								break;
							}
						}
					}
				}
				totalSum += nearestDist;
			}

			avgNN = totalSum / nodes.length;
			m = .6291 * Math.pow(nodes.length/width/width, -0.503301)
			z = (avgNN - m) / (0.328 * Math.pow(nodes.length, -1.00728) * Math.pow(width, 1.00939))
			
			return z
	}

	function calculateBestDistance(nodes, width){
		//Nodes in this case refer to the selected Nodes.
		if (nodes.length == 1) nodes = [];
		var leastDistance = {};
		var distanceArray = [];
		var edgeLimit = Math.ceil(nodes.length * 1) //Modify this to change the nodes/edges
		var distance;
		
		for (var chosen = 0; chosen < nodes.length; chosen++){
				smallDist = 9999;
				x1 = nodes[chosen].index%width;
				y1 = Math.floor(nodes[chosen].index/width);
				for (var i = chosen; i < nodes.length; i++){
					if (i !== chosen){
						x2 = nodes[i].index%width;
						y2 = Math.floor(nodes[i].index/width);

						distance = findDistance(x1, y1, x2, y2, width);
						
						distanceArray.push([nodes[chosen].searchText, nodes[i].searchText, distance])
						if (distance < smallDist){
							smallDist = distance;
							leastDistance[nodes[chosen].searchText] = [nodes[i].searchText, distance];
							if (leastDistance[nodes[i].searchText] == undefined || leastDistance[nodes[i].searchText][1] > smallDist){
								leastDistance[nodes[i].searchText] = [nodes[chosen].searchText, distance];
							}
						}
					}
				}
		}
		
		distanceArray.sort(function(a,b){return a[2]-b[2]})
		var edges = distanceArray.slice(0, edgeLimit)
		var trackNodes = {};
		var exportEdges = [];
		for (var i = 0; i < edges.length; i++){
			exportEdges.push({source: edges[i][0], target: edges[i][1], type: "default"})
			trackNodes[edges[i][0]] = true;
			trackNodes[edges[i][1]] = true;
		}
		
		for (var chosen = 0; chosen < nodes.length; chosen++){
			if (nodes[chosen].searchText in trackNodes){
			} else {
			exportEdges.push({source: nodes[chosen].searchText, target: leastDistance[nodes[chosen].searchText][0], type: "default"})
			}
		}
			
		return exportEdges;
		
	}


function buildNetwork(links, w, indicatorColor){
		// in old
		var nodes ={};
		var indicatorColor = [0,255,255];
			links.forEach(
				function(link) {
					link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
					link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
				}
			);


			var force = d3.layout.force().nodes(d3.values(nodes))
						  .links(links).size([w, w])
						  .linkDistance(60).charge(-300)
						  .on("tick", tick).start();
			
			var zoom = d3.behavior.zoom().on("zoom", redraw);
			var svg = d3.select("div#chartContainer").append("svg:svg")
						.attr("class", "chart").attr("id", "NetworkView")
						.attr("height", w).attr("width", w)
						.style("display", "none")
						.attr("pointer-events", "all").append('svg:g')
						.call(zoom)
						.append('svg:g')
						.attr('id','zoom-g');

			svg.append('svg:rect').attr('width', w*75).attr('height', w*75)
								  .attr("x", w*-32.5).attr("y", w*-32.5)
								  .attr('opacity', 0);

			var link = svg.selectAll('.link').data(force.links()).enter().append('line')
							.attr('class', 'link')
							.style("fill", "none")
							.style("stroke", "#666")
							.style("stroke-width", "1.5px");

			var node = svg.selectAll('.node').data(force.nodes()).enter().append('g').attr('class', 'node')
			.on('mouseover', mouseover).on('mouseout', mouseout).call(force.drag);


			node.append('circle').attr('r', 8)
				.style('fill', "rgb("  + indicatorColor.join(",") + ")")
				.style('stroke', "#CCC")
				.style("stroke-width", "1.5px");

			node.append('text').attr('x', 12).attr('dy', '.35em').style("font", "10px sans-serif")
				.style("pointer-events", "none").text(function(d) { return d.name; });
			
			document.getElementById("networkView").disabled = false;	


			d3.select("#NetworkView").append('svg:image')
				.attr("xlink:href","CSS/images/fullscreen.png")
				.attr("width",20)
				.attr("height",20)
				.attr('id','enlargeNetwork')
				.style('opacity',0.65)
				.on('mouseover',function(){
					d3.select("#enlargeNetwork").style('opacity',1);
				})
				.on('mouseout',function(){
					d3.select("#enlargeNetwork").style('opacity',0.65);
				})
				.on('click',enlargeNetworkView);	

				d3.select("#NetworkView").append('svg:image')
				.attr("xlink:href","CSS/images/normalsize.png")
				.attr("width",20)
				.attr("height",20)
				.attr('id','shrinkNetwork')
				.style('opacity',0.65)
				.style('display','none')
				.on('mouseover',function(){
					d3.select("#shrinkNetwork").style('opacity',1);
				})
				.on('mouseout',function(){
					d3.select("#shrinkNetwork").style('opacity',0.65);
				})
				.on('click',shrinkNetworkView);

			function enlargeNetworkView(){
				d3.select('#NetworkView').attr('class','EnlargeNetworkView');
				d3.select('#enlargeNetwork').style('display','none');
				d3.select('#shrinkNetwork').style('display','inline');

			}

			function shrinkNetworkView(){
				d3.select('#NetworkView').attr('class','');
				d3.select('#shrinkNetwork').style('display','none');
				d3.select('#enlargeNetwork').style('display','inline');
				zoom.scale(1);
				zoom.translate([0,0]);
				d3.select('#networkView g g').attr('transform', 'translate(' + zoom.translate() + ') scale(' + zoom.scale() + ')');
			}	


			function tick(){
				link.attr('x1', function(d) { return d.source.x; })
					.attr('y1', function(d) { return d.source.y; })
					.attr('x2', function(d) { return d.target.x; })
					.attr('y2', function(d) { return d.target.y; });

				node.attr('transform', function(d){ 
					return 'translate(' + d.x + ',' + d.y + ')'; 
					});
				}

			function mouseover() {
				d3.select(this).select('circle').attr('r', 16);
				}

			function mouseout(d) {
				d3.select(this).select('circle').attr('r', 8);
				d.fixed = true;
				}

			function redraw() {
				svg.attr('transform','translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')');
				}
				
	
	}

	//------------------------------
	// Gene List Enrichment
	//------------------------------
		function isEmpty(obj){
			for (var i in obj){
				if (obj.hasOwnProperty(i)){ return false; };
			}
				return true;
		}
		
		function countKeys(obj){
			var count = 0, key;
			for (var key in obj){
				if (obj.hasOwnProperty(key)){
					count += 1;
				}
			}
			return count;
		}
		
		function createUniqueArray(array){
			var uniqueDict = {} , uniqueArray = [];
			for (index in array){
				elements = array[index];
				for ( i in elements){
					uniqueDict[elements[i]] = 1;
				}
			}
			for (element in uniqueDict){
				uniqueArray.push(element);
			}
			return [uniqueDict, uniqueArray];
		}
		
		
		function viewLock(){
			if (G_VAR.lockView == "mainSVG"){
			}
			else if (G_VAR.lockView == "networkView"){
			}
			else if (G_VAR.lockView == "pvalueCanvas"){
			}
			else if (G_VAR.lockView == "showTable"){
			
			}
		
		}
		function calculateGeneFill(nodes, elements, hexCode, infoDict, infos){
			
			document.getElementById("networkView").disabled = true;
			document.getElementById("pvalueCanvas").disabled = true;

			console.log('geneFill');
			
			
			var contA, contB, contC, contD;
			var nodeList = [];		// Stores Fisher Test Results
			var listDownload = [];			
			var rawList = elements.toUpperCase().split("\n");
			var elementAssoc = {};
			var checkList = {};
			var elementList = [];


			if (isEmpty(infoDict)){
					G_VAR.infoDict = infoDictMaker(infos);
					infoDict = G_VAR.infoDict;
			}
			
			for (var index in rawList){ //remove duplicates
					elementAssoc[rawList[index].toUpperCase()] = 1;
				}
				
			for (var key in elementAssoc){ //remove non-mapped entries
				if (key in infoDict){
					elementList.push(key);
				}
			}
			
			// Create contigency table for Fisher Test
			// contA = Kinase/Element List Intersect, contB = Kinase/Other Genes Intersect
			// contC = Other Kinases/ Element List Intersect, contD = Other kinases/ Other Genes


				var totalGeneCount = countKeys(infoDict);				
				var totalElementCount = elementList.length;
				
				// Calculate pvalue using FisherTest

				for (var key in infos){
					var info = infos[key];
					var contigencyTable = []; 
					var genesIntersect = [];
					contA = 0;

					
					checkList = {};
					var contC = 0;
					for (var index in info){
						if (!(info[index].toUpperCase() in checkList)){   //Remove effect of any duplicate genes in the info line.
							contC += 1
							checkList[info[index].toUpperCase()] = 1;
							if ((info[index].toUpperCase() in elementAssoc)){ //Get intersection
								contA += 1;
								genesIntersect.push(info[index]);
							}
						}
					}

					if (contA !== 0){
						var contB = totalElementCount - contA;
						var contD = totalGeneCount - contC;
						var pvalue = fisherExact(contA, contB, contC, contD)
						nodeList.push([key.toUpperCase(), pvalue.toExponential(3), contA + contB, elementList.length, contA, genesIntersect.join(";")])
						listDownload.push([key.toUpperCase(),pvalue])
					}
				}

				//Create the List download File
				nodeList.sort(function(a,b){return a[1]-b[1]});
				nodeTextFile = [["Node Name", "P-value", "Total Genes in Gene Set", "Total Genes in Input", "Total Genes Intersected", "Intersecting Genes"].join('\t')];
				nodeNames =[];
				dictNode = {};
				

					
				for (var i = 0; i < nodeList.length; i++){
					if (nodeList[i][1] < 0.05){
						dictNode[nodeList[i][0].toUpperCase()] = nodeList[i][1]
						nodeNames.push(nodeList[i][0].toUpperCase())
						nodeTextFile.push([nodeList[i][0], nodeList[i][1], nodeList[i][2], nodeList[i][3], nodeList[i][4], nodeList[i][5]].join('\t'))
					} else {
						break
					}
				}


				nodeList = nodeList.slice(0,20);
				nodeNames = nodeNames.slice(0,20);
				G_VAR.nodeList = nodeList
				G_VAR.nodeNames = nodeNames
				manhattanNodes = [];
				pvalueCanvas(nodeList)

				//BH correction for p-values.
				raw_pvalues = _.map(nodeList,function(item){return parseFloat(item[1]);});
				raw_pvalues_reverse = raw_pvalues.reverse();
				corrected_pvalues = [];

				var currentListCount = raw_pvalues.length;
				var totalListCount = raw_pvalues.length;
				var previousValue = 1;
				var adjustedPvalue = 0;

				for (var i = 0; i < totalListCount; i++){
					adjustedPvalue = raw_pvalues_reverse[i] *  totalListCount / currentListCount; 
					
					//Preserve Monotonicity
					corrected_pvalues[i] = (adjustedPvalue < previousValue) ? adjustedPvalue : previousValue; 
					previousValue = corrected_pvalues[i]
					currentListCount -= 1;
				}

				corrected_pvalues_str = _.map(corrected_pvalues,function(item){return item.toExponential(3);});
				corrected_pvalues_str = corrected_pvalues_str.reverse();




			document.getElementById("showTable").disabled = false;	
			
			var dispNodes = [];

			for (var i in nodes){
				if (nodeNames.indexOf(nodes[i].searchText) > -1){
						manhattanNodes.push(nodes[i])
						dispNodes.push([i, nodes[i], dictNode[nodes[i].searchText]])
				}
			}


			dispNodes.sort(function(a,b){return a[2]-b[2]});

			for (var i = 0; i < dispNodes.length; i++){
				nodes[dispNodes[i][0]].circleMaker(hexCode, .6 + (.4/(i+1)));
			}
	
			manOutput = manhattanDistance(manhattanNodes,G_VAR.width)
			nodeNameList = []
			checkList= {}
			
	
			for (var index in manhattanNodes){
				if (!(manhattanNodes[index].searchText in checkList)){
					nodeNameList.push(manhattanNodes[index].searchText);
					checkList[manhattanNodes[index].searchText] = 1;
				}
			}
			zscore = clusterFind(nodeNameList, manhattanNodes, G_VAR.width)
			manOutput.push(zscore)

			circleMake(nodes, 300 / Math.sqrt(G_VAR.nodes.length));	
			elementList.sort();


			// Creates the table for the Gene Set Enrichment

			var GSE = d3.select("#selectionDisplay4").style('display','none').append("div").attr("class", "GSE").attr("id", "GSE");


			baseTable = GSE.append("table").attr("id", "GSEElement1").attr("class", "contain");
			baseTable.selectAll("th").data(["Enriched Term", "Pvalue","FDR"]).enter().append("th").text(function(d){return d;});
			for (var i = 0; i < nodeList.length; i++){
				var tableRow = baseTable.append("tr").attr('overlap-genes',nodeList[i][5].split(';').join('\n'));
				for (var x = 0; x < 3; x++){
					if(x==0)
						tableRow.append("td").append('div').style('max-width','238px')
															.attr('class','wordwrap')
															.text(nodeList[i][x]);
					else if(x==1)
						tableRow.append("td").append('div').style('width','42px').text(nodeList[i][x]);
					else
						tableRow.append("td").append('div').style('width','42px').text(corrected_pvalues_str[i]);

				}		
			}

			

			
			//Builds the Network View
				document.getElementById("mainSVG").style.display = "inline";
				$("#NetworkView").remove();
				var w = 300;
				
				var links = calculateBestDistance(manhattanNodes, G_VAR.width);
				
				buildNetwork(links, w, hexCode)



			// Adding Manhattan 
					var manhattan = d3.select("#selectionDisplay3").append("div").attr("class", "manhattan").attr("id", "manhattan");
					manhattan.append("p").attr("id", "clusterTitle").text("Clustering Z-Score")
					manhattan.append("p").text("Negative z-score corresponds to clustering.")
					var baseTable = manhattan.append("table").attr("class", "containManhattan");

			
					geneTable = baseTable.append("td").attr("id", "col2").append("table").attr("id", "manhattan_gene")
					geneTable.selectAll("th").data(["Avg. Pair Distance", "Standard Dev.", "Z-Score"]).enter()
						.append("th").text(function(d){return d;});
					
					geneTable.append("tr").selectAll("td").data(manOutput).enter().append("td")
									.attr("opacity", 1)
									.text(function(d){return d.toString().slice(0,6)})
									.transition()
										.duration(2000)
										.ease(Math.sqrt);


					canvas.selectAll("circle").remove();
					indicate = canvas.selectAll("circle");
					circleMake(nodes, 300 / Math.sqrt(G_VAR.nodes.length));

					d3.selectAll("#textdownload").remove();
					d3.selectAll("#toggleChart").remove();

					document.getElementById(lastView).checked = true;
					if(lastView!="mainCanvasSelector")
					selectAlternateView();

					
					//createTextFile(nodeTextFile.join('\n'))

		}
			
		function geneFill(nodes, elements, hexCode, infoDict, infos){
			// Calculates the enrichment of a node for a user-inputed set of elements.
			// Outputs a p-value based on the Fisher's Exact Test.
			// Calculates the manhattan distance between those nodes.
			// Creates a bar graph and a table that shows the most significant results of the analysis.
			// Creates a text file containing the full table.

			indicateClear(nodes);
			var count = 0;
			
			
			if (isEmpty(G_VAR.infos) == true) {
				var wait = self.setInterval(function(){
				
					if (isEmpty(G_VAR.infos) == false){
						clearInterval(wait);
						infos = G_VAR.infos;
						G_VAR.infoDict = infoDictMaker(infos);
						//document.getElementById("selectionDisplay3").innerHTML = "";
						calculateGeneFill(nodes, elements, hexCode, infoDict, infos);
						
					} else {
						pleaseWait(count, "selectionDisplay3", "innerHTML");
						count += 1;
					}										
					} , 100);

			} else { 
				calculateGeneFill(nodes, elements, hexCode, infoDict, infos);
			}
			
			
			
		messenger.trigger('tableRendered');	
			
		}



	//----------------------------------
	// Fisher Exact Test = Right Tailed
	//----------------------------------
		function factorialLog(x){
			if (storeFact[x] !== undefined){
				return storeFact[x];
			} else {
				var start = storeFact.length;
				for (i = start; i <= x; i++){
					storeFact.push(storeFact[i-1] + Math.log(i));
				}
			}
			return storeFact[x];
		}
		
		
		function fisherExact(contA, contB, contC, contD){
			//Calculate RIGHT-SIDED FISHER EXACT
			var numerator, denominator, p = 0;
			var min = (contC < contB) ? contC : contB;

			for (var q = 0; q < min + 1; q++){ 
				numerator  = factorialLog(contA + contB) + factorialLog(contC + contD) 
									+ factorialLog(contA + contC)+ factorialLog(contB + contD);

				denominator = factorialLog(contA) + factorialLog(contB) + factorialLog(contC) 
									+ factorialLog(contD) + factorialLog(contA + contB + contC + contD);
				p += Math.exp(numerator - denominator);
				
				contA += 1
				contB -= 1
				contC -= 1
				contD += 1
			
			}
			return p;
		}
			
				 


	//-----------------------------
	// Canvas Options Functionality
	//-----------------------------


		function scaleColor(nodes, avgWeight, modWeight, canvasRGB, canvasSize){
			// Modifies the color scaling of the SVG, giving greater contrast to similarly colored elements.

			if (avgWeight != 1.0){
				var scale = Math.log(modWeight)/Math.log(avgWeight);
			}
			
			for (var i = 0; i < nodes.length; i++){
				nodes[i].colorizer(scale, canvasRGB);
			}
			weight_visualize(nodes, canvasSize);	
			G_VAR.scale = scale;
			
			return;
		}


		function centerCanvas(nodes, canvasSize){
			// Centers canvas with current attributes on click.
			G_VAR.scaleZoom = 1;
			G_VAR.translateZoom = [0,0];
			d3.selectAll("svg#mainSVG").remove();
			createCanvas(canvasSize);
			weight_visualize(nodes, canvasSize);
			canvas.on("mousedown", find);
		}

		function resetColorScale(nodes, canvasRGB, canvasSize){
			var scale = 1.00;
			for (var i = 0; i < nodes.length; i++){
				nodes[i].colorizer(scale, canvasRGB);
			}
			weight_visualize(nodes, canvasSize);
			G_VAR.scale = scale; 

			document.getElementById('colorScale').innerHTML = G_VAR.avgWeight.toString().slice(0,4);
			document.getElementById('range_colorScale').value = G_VAR.avgWeight.toString().slice(0,4);
		}
	

	//------------------------------
	// Canvas Creation Functionality
	//------------------------------

		
			
		function visualizeIt(G_VAR){
			
			createCanvas(G_VAR.canvasSize);	
			weight_visualize(G_VAR.nodes, G_VAR.canvasSize);
			canvas.on("mousedown", find);

		}
			


		function circleMake(nodes, pixels){
			
			var radius = Math.floor(pixels/2.5);
			var width = Math.sqrt(nodes.length);
			

			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				if (node.circles.length !== 0){
					circles = indicate.data(node.circles).enter().append("svg:circle");
					circles.attr("cx", (node.index % width) * pixels + pixels/2)
						.attr("cy", Math.floor(node.index / width) * pixels + pixels/2)
						.attr("fill", function(d) { return d[1];})
						.attr("opacity", function(d){ return d[3]})
							.attr("r", function(d) {return(radius * d[2]);});
					circles.append("title").text(function(d) {return d[0]; })	
				}
			}
		}
				
		function rectMake(nodes, pixels){
			// Defines the square attributes. Position and color are controlled here.
			var width = Math.sqrt(nodes.length);
			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				rects = rect.data([node]).enter().append("svg:rect");
				rects.attr("x", function(d){ return d.index%width * pixels;})
							.attr("y", function(d) { return Math.floor(d.index/width) * pixels;})
							.attr("width", pixels)
							.attr("height", pixels)
							.attr("fill", function(d) {return d.color});
				rects.append("title")
			        .text(function(d) { return d.text; });
			}
		}		



		function weight_visualize(nodes, canvasSize){
			// Removes all elements of canvas and then recreates those elements
			// Object removal prevents multiple elements from appearing when the SVG is downloaded.
			var pixels = canvasSize / Math.sqrt(nodes.length);
			canvas.selectAll("rect").remove();
			canvas.selectAll("circle").remove();
			rectMake(nodes, pixels);
			circleMake(nodes, pixels);
		}

		function createCanvas(canvasSize){
			// Creates the canvas. Called during initialization, centering, or resizing the SVG canvas.
			canvas = d3.select("div#svgContainer")
						.append("svg:svg")
						.attr("id","mainSVG")
						.attr("width", canvasSize)
						.attr("height", canvasSize)
						.attr("pointer-events", "all")
					  .append('svg:g')
						.attr("id", "zoomLayer")
						.call(d3.behavior.zoom().on("zoom", redraw))
					  .append('svg:g')
						.attr("id","main");

			// Fill Canvas with Weights and Names
			rect = canvas.selectAll("rect");
			indicate = canvas.selectAll("circle");
		}

		function NodeObj(index, weigh, text){
		
			this.index = index;
			this.weight = weigh;
			this.text = text;
			this.searchText = text.toUpperCase();
			this.circles = [];
			this.circleMaker = function(RGB, opacity){
				var adjust = Math.pow(0.7, this.circles.length);
				this.circles.push([this.text, ["rgb(", RGB.join(","), ")"].join("") , adjust, opacity]);
			}
				
			this.circleClear = function(){
				this.circles = [];
			}
			
			
			
			this.colorizer = function (scale, canvasRGB){
				var oriNum = [];
				for (i=0; i<3; i++){
						oriNum.push(Math.floor(canvasRGB[i] * Math.pow(this.weight, scale)/Math.pow(8, scale)));			
					}
				this.color = ["rgb(", oriNum.join(","), ")"].join("");
			}

		}



	//---------------------------------------
	// Gene Count Selection and Zoom Features
	//---------------------------------------
	

		function redraw() {
			// Allows panning and zooming of the canvas.
			if (d3.event.scale <= 1){
				// Constrains the zoom function, preventing panning or zoom-out when canvas is already at full size.
				d3.event.scale = 1;
				d3.event.translate = [0,0];
				d3.select('#zoomLayer').call(d3.behavior.zoom().on("zoom", null));
				d3.select('#zoomLayer').call(d3.behavior.zoom().on("zoom", redraw));

			}
			canvas.attr("transform", "translate(" + d3.event.translate + ")"
		      + " scale(" + d3.event.scale + ")");

			G_VAR.scaleZoom = d3.event.scale;
			G_VAR.translateZoom = d3.event.translate;
		}
		
		function seeScale(value){
			document.getElementById('colorScale').innerHTML=value.toString().slice(0,5);
		}
		
	//-------------------------
	// Menu/Tab/Display + Label Display
	//-------------------------


		function displayTab(form_number){
				for (i = 1 ; i < 3 ; i++){
					if (i === form_number){
						document.getElementById('form'+i).style.display = 'block';
						document.getElementById('tab'+i).style.fontWeight = '700';
						document.getElementById('tab'+i).style.backgroundColor= '#FFF';
					}
					else{
						document.getElementById('form'+i).style.display = 'none';
						document.getElementById('tab'+i).style.fontWeight = '400';
						document.getElementById('tab'+i).style.backgroundColor= '#CCC';
					}
				}
		}


		function find(){
			// Uses the textMap to get Node Name and Additional Information and places it into the Display Info div.
			var width = Math.sqrt(G_VAR.nodes.length)
			var pixels = G_VAR.canvasSize / width;
			var m = d3.svg.mouse(this);
			var column = Math.floor(m[0]/pixels);
			var row = Math.floor(m[1]/pixels);
			var index = row * width + column;
			document.getElementById('nodeName').innerHTML = G_VAR.nodes[index].text;
				var count = 0;
				var wait = self.setInterval(function(){				
					if (isEmpty(G_VAR.infos) == false){
						if (G_VAR.infos[G_VAR.nodes[index].searchText]){
							document.getElementById('additionalInfo').innerHTML = G_VAR.infos[G_VAR.nodes[index].searchText].join(', ')
						} else {
							document.getElementById('additionalInfo').innerHTML = "None";	
						}
						clearInterval(wait);
						document.getElementById('infoReminder').innerHTML = "";
						
					} else {										
							pleaseWait(count, "additionalInfo", "innerHTML");
							count += 1;
					}										
				} , 100);

			return; 
		}

	