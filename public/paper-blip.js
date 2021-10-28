/*
 *    Template for paper.js - global implementation
 */


function downloadDataUri(options) {
  if (!options.url)
    options.url = "http://download-data-uri.appspot.com/";
  $('<form method="post" action="' + options.url
    + '" style="display:none"><input type="hidden" name="filename" value="'
    + options.filename + '"/><input type="hidden" name="data" value="'
    + options.data + '"/></form>').appendTo('body').submit().remove();
}

$('#export-button').click(function() {
  // http://paperjs.org/reference/project/#exportsvg
  let export_options = {
    'bounds': 'view',	// 'content' uses outer stroke bounds
    'precision' : 5,	// amount of fractional digits in numbers used in SVG data 
    'asString': true 
  }
  var svg = project.exportSVG(export_options);
  downloadDataUri({
    data: 'data:image/svg+xml;base64,' + btoa(svg),
    filename: 'export.svg'
  });
});

paper.install(window);

window.onload = function() {
  
    // * Setup
  paper.setup('papercanvas');
  
  const tool = new Tool();
  const static = new PaperTool()
  const center = new Point(view.size.width/2, view.size.height/2)

  view.onFrame = function(event){   
      // * Loop
  }

  tool.onMouseDown = function(event){
    // if(event.event.button==0)
  }

  tool.onMouseDrag = function (event){
  }


  tool.onKeyDown = function(event) {
    // event.key
  }

  function start(){
    
    let beg = center
    let via = static.randomPointFrom(center,200)
    let end = static.randomPointFrom(center,400)
    
    let line = new Path.Arc({
      from: beg,
      through: via,
      to: end,
      // strokeColor: 'black',
    })
    // line.smooth()
    
    let begRad = static.random(1,60)
    let endRad = begRad + static.random(100,300)
    var step = static.random(5,25)
    
    for(let x=0;x<line.length; x+= step){
      let rad = static.linear(x,0,line.length, begRad,endRad)
      let p = line.getPointAt(x)
      new Path.Circle({
        center: p,
        radius: rad,
        strokeColor: 'black',
      })
    }

  }

  start();
  paper.view.draw();
  
  // * Eo window.onload
}

