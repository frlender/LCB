
// $( "#upGenes" ).tooltip({
// 	tooltipClass:"custom-ui-tooltip",
//     //color label after open event
//     open: function(event,ui){
//         $("#upGenes").addClass('activeToolTip');
        
//     },
//     //remove color from label after close event
//     close:function(event,ui){
//         $("#upGenes").removeClass('activeToolTip');
//     },
//     });

// $( "#dnGenes" ).tooltip({
// 	tooltipClass:"custom-ui-tooltip",
//     open: function(event,ui){
//         $("#dnGenes").addClass('activeToolTip');
//     },
//     close:function(event,ui){
//         $("#dnGenes").removeClass('activeToolTip');
//     },
// });

// $('#Regulation').tooltip({
//         tooltipClass:"custom-ui-tooltip",
//         open: function(event,ui){
//             ui.target.addClass('activeToolTip');
            
//         },
//         close:function(event,ui){
//             ui.target.removeClass('activeToolTip');
//         },
//     });
// })


    // tooltips for enrichment results table.

  var tableRenderedListener = {};
  _.extend(tableRenderedListener,Backbone.Events);
  
  // listener function is necessary. Because the table is 
  // constantly changing, which I did not realize that at first time and takes
  //.me A lot of time to debug this.

  //"tableRendered" event is at the last line of geneFill() function in 
  // visualizer17.js


  // tableRenderedListener.listenTo(messenger,'tableRendered',function(){
  //       $('#GSEElement1').tooltip({
  //       position: {
  //           my: "right",
  //           at: "left",
  //       },
  //       show:{
  //           duration: 100
  //       },
  //       hide:{
  //           duration:100
  //       },
  //       tooltipClass:"custom-ui-tooltip",
  //       items:"[overlap-genes]",
  //       content: function(){
  //           return $(this).attr('overlap-genes');
  //       },
  //       open: function(event,ui){
  //           ui.target.addClass('activeToolTip');
            
  //       },
  //       close:function(event,ui){
  //           ui.target.removeClass('activeToolTip');
  //       },
  //   });
  // });
