 var blockUIcss = { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        }

$(document).ready(function() {
    $('#upTable').dataTable({aaSorting: [],
     
      aoColumns:[{"sTitle":"Overlap","sClass":"center"},{"sTitle":"Info (Perturbation, Dose, Time, Cell, Batch)"}]});
    d3.selectAll('label').remove();

    $.get(domainAddr+'getCount.php',function(data){
      d3.select('#searchCounter').text(data);
    })
   
} );


// counter to update and get the nummber of searched lists.
// var Counter = Backbone.Model.extend({
//       defaults:{
//         count: 1,
//         id: 1
//       },

//       url: function(){
//         return 'http://www.maayanlab.net/LINCS/LCB_counter_server/search_counter';
//       }
// });
// var counter = new Counter;

// // update the counter text in html page when counter.fetch() triggers change event.
// var object = {};
//   _.extend(object,Backbone.Events);
//   object.listenTo(counter,"change",function(){
//     d3.select('#searchCounter').text(counter.get('count'));
// });



var g_upCheck = false;
var g_dnCheck = false;
var g_reverse = false;
var g_Aggr_reverse_label = 'Aggravate';
var progressCall;
var signature ;
var domainAddr = 'http://www.maayanlab.net/LINCS/test/execuTest/';
//var domainAddr = 'http://127.0.0.1/execTest/';
var purl = domainAddr + 'progressTotal.php';
var eurl = domainAddr + 'emptySignature.php';
var callStopped = true; //prevent delayed progress callback after processing terminates


function textEmpty(listId){
  
  if(d3.select('#'+listId+ 'List').property('value')){
    
    d3.select('#'+ listId + 'Check').attr('disabled',null);}
  else{
    d3.select('#'+ listId + 'Check').attr('disabled','disabled');
    $('#'+ listId +'Check').prop('checked',false);
    checkit(listId);
  }
}



function checkit(checkId){
  if(checkId=='up')
     g_upCheck = d3.select('#upCheck').property('checked');
   else
     g_dnCheck = d3.select('#dnCheck').property('checked');

   if(g_upCheck || g_dnCheck)
   {
    d3.select('input[value=Search][type=button]').classed('myInactiveButton',false).classed('myButton',true);
     $('input[value=Search][type=button]').unbind('click');
      $('input[value=Enrichr]').unbind('click');
     $('input[value=Search][type=button]').click(function(){sendGenes();});
      $('input[value=Enrichr]').click(function(){enrichrIt();});
    d3.select('input[value=Enrichr]').classed('myInactiveButton',false).classed('myButton',true);

                                                   
   }
   else
   {
    d3.select('input[value=Search][type=button]').classed('myButton',false).classed('myInactiveButton',true);
    $('input[value=Search][type=button]').unbind('click');
     $('input[value=Enrichr]').unbind('click');
    d3.select('input[value=Enrichr]').classed('myButton',false).classed('myInactiveButton',true);

   }
}

  function sendGenes(){


 	var dngenes = d3.select('#dnList').property('value');
 	var upgenes = d3.select('#upList').property('value');
 	upgenes = $.trim(upgenes).toUpperCase();
  dngenes = $.trim(dngenes).toUpperCase();
  
 g_Aggr_reverse_label = 'Aggravate';

  if(g_reverse){
    var temp = dngenes;
    dngenes = upgenes;
    upgenes = temp;
     g_Aggr_reverse_label = "reverse";
  }

  signature = 'temp_'+Math.random().toString(36).substring(7);
  var url;
   if(g_upCheck && g_dnCheck){
      url = domainAddr + 'updn.php';
      post2php(url,{upgenes:upgenes,dngenes:dngenes,signature:signature},'(Up/Down/'+g_Aggr_reverse_label+')');
      progressCall = setInterval(function(){getProgress(signature);},1000);
    }
     else if((g_upCheck && g_Aggr_reverse_label=='Aggravate')||(g_dnCheck && g_Aggr_reverse_label=='reverse')){
       // url = 'http://127.0.0.1/temp/lcbcount/upNew.php';
       url = domainAddr + 'up.php';
        post2php(url,{upgenes:upgenes,signature:signature},'(Up/'+g_Aggr_reverse_label+')');
        progressCall = setInterval(function(){getProgress(signature);},1000);
    }
    else{
      url = domainAddr + 'dn.php';
      post2php(url,{dngenes:dngenes,signature:signature},'(Down/'+g_Aggr_reverse_label+')');
      progressCall = setInterval(function(){getProgress(signature);},1000);
    }
}

function post2php(url,dataobj,label){

  $.blockUI({ css: blockUIcss, message: "Please waiting for server response...."});
    var count;
    switch(label){
      case '(Up/Down)':
      count ='149, 984';
      break
      default:
      count = '74, 992';
    }
    callStopped = false;
    $.ajax({
      type:"POST",
      url: url,
      data: dataobj,
      dataType: "text",
      timeout: 1200000,
      success: function(data){
        callStopped = true;
        clearInterval(progressCall);
        emptySignature(dataobj.signature);
        try{
          res = JSON.parse(data);
          d3.select('.blockMsg').text(count+' gene lists compared !');
          setTimeout(function(){$.unblockUI();},1500);
          currentCount = parseInt(res[2])+1;
          console.log(currentCount);
          d3.select('#searchCounter').text(currentCount.toString());
        }
        catch(err){
          d3.select('.blockMsg').text("Please retry, error as:" + data);
        }
        d3.select('#header_suffix').text(label);
        addLinks(res,'up');
      },
      error: function(errObj,ajaxOptions,thrownError){
        console.log('error begin');
        console.log(errObj.status);
        console.log(thrownError);
        console.log(ajaxOptions);
        console.log('error end');
      }
    });
    

}

function getProgress(persignature){
  $.post(purl,{signature:persignature},function(data){
    if(callStopped) return;
    var percent = Math.round(parseFloat(data)*100);
     d3.select('.blockMsg').text("Processing.... " + percent + "% complete");

  });
}

function emptySignature(persignature){
  $.post(eurl,{signature:persignature});
}
  function addLinks(res,tableId){

  	 	var keys = Object.keys(res[0]);
  	 	var overlap = res[0];
  	 	var info = res[1];
  	 	var sortArr = []; // auxiliary list to help sort based on 
  	 	                  //intersection size.
 		for (key in overlap)
 			sortArr.push([overlap[key], info[key], key]);


 		sortArr.sort();
 		sortArr.reverse();

    var obj = {};
    obj.aaData = [];

    for (i in sortArr){
    var perInfo = sortArr[i][1];
    var inputInfo = '<a href="' + 'index.html?id=' + sortArr[i][2] +'" target="_blank">'+ sortArr[i][1] +'</a>';
    obj.aaData.push([sortArr[i][0].toFixed(4),inputInfo]);
  }

    obj.aoColumns = [{"sTitle":"Overlap","sClass":"center"},{"sTitle":"Info (Perturbation, Dose, Time, Cell, Batch)"}];

    if(d3.select('#'+tableId+'Table_wrapper').empty()){
    var table = $('#'+tableId+'Table').dataTable(obj);
    table.fnSort([[0,'desc']]);
    table.fnAdjustColumnSizing();

    d3.selectAll('label').remove();// remove search box and show entries in defualt dataTable seeting
    }
    else
    {
      var table=$('#'+tableId+'Table').dataTable();
      table.fnClearTable();
      table.fnAddData(obj.aaData);
      table.fnSort([[0,'desc']]);
      table.fnAdjustColumnSizing();
    }
    

	 	}

    function clearText(listId){
      d3.select('#'+listId+'List').property('value','');
      textEmpty(listId);
    }

    function example(){
var dn = "MTF2\nSYNCRIP\nSLPI\nMRPL19\nCOX17\nKIAA0494\nC7ORF42\nANKS1A\nPSMB4\nAREG\nELOVL6\nCSTF2T\nCYR61\nUGT2B28\nSEC63\nHDGFRP3\nEFS\nPER1\nMNAT1\nPDZD8\nADRB2\nEFS\nCDCA4\nMAPK1IP1L\nKCNJ15\nPELI1\nZC3H12A\nRAB11FIP2\nITSN2\nGLDC\nCYB5R2\nMFAP5\nH1F0\nMYH10\nHDDC2\nSERHL2\nSERHL2\nBECN1\nPER1\nCOX7C\nZNF589\nTGFBR2\nIDE\nADO\nNME7\nFAM158A\nMIF\nLIMCH1\nIDE\nPOLR1E\nLMNB1\nEIF5\nRBM12\nCHIC2\nALDH3B2\nFXYD5\nLAMC2\nANKRD27\nUSP7\nPXMP2\nCOX6B1\nSTAMBP\nPLP2\nCASC3\nSNRPF\nTOMM34\nRPA1\nKCNK1\nRFX5\nELOVL1\nNDUFB4\nARHGEF5\nSUV39H1\nRAB21\nLBR\nTFRC\nAP2S1\nDLD\nRPA1\nTES\nELOVL1\nHDAC2\nGTF2A2\nPRSS23\nTUBA4A\nGAPDH\nG6PD\nTES\nDDX3Y\nCXCL2\nCLTB\nPOLR2I\nCLTB\nCLTB\n";
var up = "SYNGR3\nCDH3\nNCK1\nTKTL1\nNUSAP1\nBAG3\nNR2F6\nNCK1\nPCNA\nTUBD1\nKIF5C\nRAB27A\nETV1\nAPPBP2\nTSPAN4\nRAB27A\nAPPBP2\nETV1\nXIST\nXIST\nSIRT3\nGATAD1\nNPDC1\nBTN3A2\nVPS28\nSATB1\nCETN3\nPRPF4\nSMC1A\nRAB31\nAPPBP2\nTAPBP\nETV1\nNOL7\nRXRB\nETV1\nBTN3A1\nCHAD\nC16ORF58\nETV1\nEMR2\nPAK1\nCTNNAL1\nPOMT1\nC6ORF62\nHEATR6\nNHEJ1\nUBE3B\nPRKAB1\nDNAJC12\nAMDHD2\nZKSCAN5\nPDE3B\nNVL\nBTN3A2\nPDE3B\nNUMA1\nVAMP3\nCDC45\nABHD4\nFBXW2\nFAM134B\nFLOT1\nVAMP3\nCLSTN2\nZMYM5\nITGAL\nTNFRSF14\nSIK2\nTSPAN7\nRSF1\nSLC7A11\nALG8\nLOC730101\nPEX1\nUSP20\nDEAF1\nC11ORF30\nPSMB8\nCSPG5\nST6GALNAC2\nDCAF8\nPPM1D\nP2RX4\nIL6R\nFNTB\nFBXO38\nYME1L1\nBAALC\nITGAE\nAHI1\nTADA2A\nCDC25C\nUSP10\nAGA\n";
d3.select('#upList').property('value',up);
d3.select('#dnList').property('value',dn);
d3.select('#'+ 'up' + 'Check').attr('disabled',null);
d3.select('#'+ 'dn' + 'Check').attr('disabled',null);
    }

function enrichrIt(){
    var dngenes = d3.select('#dnList').property('value');
  var upgenes = d3.select('#upList').property('value');
  var reg = RegExp('[^\\w\\n]');
  while(reg.test(dngenes[dngenes.length-1]))
    dngenes = dngenes.trimRight();

  while(reg.test(upgenes[upgenes.length-1]))
    upgenes = upgenes.trimRight();

var desc = ' (Aggravate)';
if(g_reverse){
    var temp = dngenes;
    dngenes = upgenes;
    upgenes = temp;
    desc = ' (Reverse)';
  }
  


  if(g_upCheck && g_dnCheck){
    var genes = upgenes+dngenes;
    alert('Up list and down list are combined as one list to Enrichr!');
     enrich({list:genes,description:'Up/Down List'});
    }
     else if(g_upCheck){
       enrich({list:upgenes,description:'Up List'+desc});
    }
    else{
     enrich({list:dngenes,description:'Down List'+desc});
    }
}

    function enrich(options) {
  var defaultOptions = {
    description: "",
    popup: false
  };

  if (typeof options.description == 'undefined')
    options.description = defaultOptions.description;
  if (typeof options.popup == 'undefined')
    options.popup = defaultOptions.popup;
  if (typeof options.list == 'undefined')
    alert('No genes defined.');

  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', 'http://amp.pharm.mssm.edu/Enrichr/enrich');

    form.setAttribute('target', '_blank');
  form.setAttribute('enctype', 'multipart/form-data');

  var listField = document.createElement('input');
  listField.setAttribute('type', 'hidden');
  listField.setAttribute('name', 'list');
  listField.setAttribute('value', options.list);
  form.appendChild(listField);

  var descField = document.createElement('input');
  descField.setAttribute('type', 'hidden');
  descField.setAttribute('name', 'description');
  descField.setAttribute('value', options.description);
  form.appendChild(descField);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
} 