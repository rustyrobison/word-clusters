// check if dragged word is in circle

var margin = {top: 10, right: 10, bottom: 30, left: 10},
    width = window.innerWidth,
    height = window.innerHeight;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var wheelData = [{'cx':(width/2),'cy':(height/2),'r':'200'}];

var wheel = svg.append("circle")
    .data(wheelData)
    // .enter()
    .attr("class", "wheel")
    .attr("cx", function(d) { return d.cx; })
    .attr("cy", function(d) { return d.cy; })
    .attr("r", function(d) { return d.r; });

// console.log(wheelData[0].cx);

var locations = d3.range(10).map(function() {
  return {
    x: Math.round(Math.random() * (width)),
    y: Math.round(Math.random() * (height)),
  };
});

console.log(locations);

var simulation = d3.forceSimulation(locations);

simulation.force("xAxis",d3.forceX(function(d) { return d.x; }))
          .force("yAxis",d3.forceY(function(d) { return d.y; }));

var textArray = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];
var words = svg.selectAll('text')
  .data(locations)
  .enter().append("text")
  .attr("x", function(d) { return d.x; })
  .attr("y", function(d) { return d.y; })
  .attr("id", function(d) { return d.index; })
    .attr("text-anchor", "start")
    .text(function(d,i){ return textArray[i]})
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
  simulation.restart();
  simulation.alpha(1.0);
  d.fx = d.x;
  d.fy = d.y;

  var a = d.x - wheelData[0].cx;
  var b = d.y - wheelData[0].cy;
  var c = Math.sqrt( a*a + b*b );  // distance from word to circle center
  if (c < wheelData[0].r) {
    d3.select(this).classed("leaving", true);
  }
  // console.log(d3.select(this).attr("id"));
  // console.log(simulation);

}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  var a = d.x - wheelData[0].cx;
  var b = d.y - wheelData[0].cy;
  var c = Math.sqrt( a*a + b*b );  // distance from word to circle center
  if (c > wheelData[0].r) {
    if (d3.select(this).classed("leaving")) {

      var me = d3.select(this).attr("id");
      console.log(locations[me]);
      // ??????????

      d3.select(this).classed("leaving", false);
    } else {
      simulation.restart();
      d.fx = null;
      d.fy = null;
      simulation.alphaTarget(1.5);
    }
  }
  d3.select(this).classed("active", false);
  // console.log("leaving = "+d3.select(this).classed("leaving"));
  // console.log(d3.select(this).attr("x"));    // !!!!  so that's how ya do it
}

 function ticked(){
     words.attr("x", function(d){ return d.x;})
          .attr("y", function(d){ return d.y;})
 }

 simulation.on("tick",ticked);
