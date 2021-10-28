/*
 *    Template for paper.js - global implementation
 */

// ********************************************

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
  

  paper.setup('papercanvas');
  var tool = new Tool();
  
  var VIEW = view.size;
  var CENTER = {
    x: VIEW.width/2,
    y: VIEW.height/2,
  }
  var DIAG = Math.sqrt(VIEW.height*VIEW.height+VIEW.width*VIEW.width)


  // ********************************************

  function polarCoordinates(a,r){
    return new Point(r*Math.cos(a) + CENTER.x, r*Math.sin(a) + CENTER.y )
  }

  function inView(vec){
    if(vec.x<0 || vec.y<0)
      return false;
    if(vec.x>view.width || vec.y>view.height)
      return false;
    
    return true;
  }

  // ********************************************

  function createSpiral({Ainit=1,Rinit=1,Fa,radIncr=(x)=>x+0.2,Abegin=0}){

    var spiral = new Path({
      closed: false,
      strokeColor: 'black',
    })

    var a = Ainit
    var r = Rinit
    var rad = 31
    var pos = CENTER

    const constant = (x,f)=> x+f
    
    const incr = ()=>{
      a = constant(a,Fa)
      r = radIncr(r)
      // r *= 1.002
      // rad = constant(rad,0.1)
    };

    //inView(pos)
    while(r<DIAG){
      var pos = polarCoordinates(a,r);
      spiral.add(pos)
      // console.log(ang,r,pos)
      // var circ = new Path.Circle({
      //   center: pos,
      //   radius: rad,
      //   strokeColor: 'blue',
      // })
      incr()
    }

    // spiral.simplify()

    return spiral;
  }
  
  
  // ********************************************

  var spiral;
  var counter;
  var x=0

  var dot = new Path.Circle({
    center: [0,0],
    radius: 5,
    fillColor: 'black'
  })
  var other = dot.clone()

  function setup(){
    const N = 100

    // * create spirals
    let rStep = 10;

    spiral = createSpiral({
      Fa: 2*Math.PI / N,
      Ainit: 0,
      Rinit: 5,
      radIncr: (x)=>{
        rStep *= 1.005
        return x + rStep/N
      }
    });
    spiral.strokeColor = '#03f'
    counter = spiral.clone()
    counter.rotate(180,CENTER)
    counter.strokeColor = '#60f'
    
    let x = 20
    // while(x<spiral.length){

    //   var p = spiral.getPointAt(x)
    //   var o = counter.getPointAt(x)
    //   var dist = p.subtract(o).length

    //   var d = new Path.Circle({
    //     center: p,
    //     radius: 5,
    //     strokeColor: 'black'
    //   })
    //   x += dist/2
    //   // rading *= 1.03
    // }
  }
  setup();
  // paper.view.draw();



  view.onFrame = function(event){   
    // * Loop
    // dot.position = spiral.getPointAt(x)
    // other.position = counter.getPointAt(x)
    // x += 10
    // paper.view.draw();
  // console.log(x,dot.center)
  }


  tool.onMouseDown = function(event){
    // if(event.event.button==0)
  }

  tool.onMouseDrag = function (event){
  }


  tool.onKeyDown = function(event) {
    // event.key
  }


  // * Eo window.onload
}

