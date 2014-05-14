
//for #nav css effects
d3.selectAll('#nav a').attr('onmouseover','OverLine(this);')
                          .attr('onmouseout','OverLineSelected();');

function OverLine(sth)
{

  deOverLine();
  sth.style.textDecoration = 'OverLine';
}

function deOverLine()
{
   d3.selectAll('#nav a').filter(function(d,i){ return i!=g_category;})
                             .style('text-decoration','');
}

function OverLineSelected()
{
   deOverLine();
   d3.selectAll('#nav a').filter(function(d,i){ return i==g_category;})
                             .style('text-decoration','OverLine');
}

// for #enrichr css effects
d3.selectAll('#enrichrBox  textarea').attr('rows',7)
                                      .attr('cols',10);
d3.selectAll('input[src="general/enrichr logo.jpg"]').attr('width',45)
                                      .attr('height',17);
