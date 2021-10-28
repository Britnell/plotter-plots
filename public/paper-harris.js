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


const largeFill = 'orange'
const smallFill = 'yellow'

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

  
  
  // ********************************************
  const RATIO = 1.325
  var shape;

  function beginRect(){
    let sh;
    let prop = VIEW.width/VIEW.height;

    if(prop>RATIO){
      // H limit
      let W = VIEW.height*RATIO
      let H = VIEW.height
      return {
        shape: new Path.Rectangle({
          point: [(VIEW.width-W)/2,0],
          size: [W,H],
          fillColor: 'grey',
        }),
        rot: 0,
      }
    }
    else if(prop<1/RATIO){
      // W limit
      let W = VIEW.width
      let H = VIEW.width*RATIO
      return {
        shape: new Path.Rectangle({
          point: [0,(VIEW.height-H)/2],
          size: [W,H],
          fillColor: 'grey',
        }),
        rot: 90
      }
    }
    else {
      // a square
      let W = VIEW.width
      let H = VIEW.width/RATIO
      return {
        shape: new Path.Rectangle({
          point: [0,(VIEW.height-H)/2],
          size: [W,H],
          fillColor: 'grey',
        }),
        rot: 0
      }
    }
    // Eo begin shape
  }

  function divideLarger({shape,rot}){

    if(rot==0){
      return {
        shape: new Path.Rectangle({
          point: shape.point,
          size: [shape.size[1]/RATIO,shape.size[1]],
          fillColor: smallFill,
        }),
        rot: 270
      }
    }
    else if(rot==180){
      let pos = [
        shape.point[0] + shape.size[0] - (shape.size[1]/RATIO),
        shape.point[1]
      ]
      return {
        shape: new Path.Rectangle({
          point: pos ,
          size: [shape.size[1]/RATIO,shape.size[1]],
          fillColor: smallFill,
        }),
        rot: 90
      }
    }
    else if(rot==90){
      return {
        shape: new Path.Rectangle({
          point: shape.point,
          size: [shape.size[0],shape.size[0]/RATIO],
          fillColor: smallFill,
        }),
        rot: 0
      }
    }
    else if(rot==270){
      let pos = [
        shape.point[0],
        shape.point[1] + shape.size[1] - (shape.size[0]/RATIO)
      ]
      return {
        shape: new Path.Rectangle({
          point: pos,
          size: [shape.size[0],shape.size[0]/RATIO],
          fillColor: smallFill,
        }),
        rot: 180
      }
    }
    // Eo divide larger
  }
  function divideSmaller({shape,rot}){

    if(rot==0){
      let L = shape.size[1]/RATIO
      let smW = (shape.size[0]-L)
      return {
        shape: new Path.Rectangle({
          point: [ shape.point[0]+L, shape.point[1] ],
          size: [smW, smW/RATIO],
          fillColor: largeFill,
        }),
        rot: 0,
      }
    }
    else if(rot==180){
      let L = shape.size[1]/RATIO
      let smallerW = (shape.size[0]-L)
      let smallerH = smallerW/RATIO
      return {
        shape: new Path.Rectangle({
          point: [ shape.point[0], shape.point[1] +shape.size[1] -smallerH ],
          size: [smallerW, smallerH],
          fillColor: largeFill,
        }),
        rot: 270,
      }
    }
    else if(rot==90){
      let L = shape.size[0]/RATIO
      let smH = (shape.size[1]-L)
      let smW = smH/RATIO
      return {
        shape: new Path.Rectangle({
          point: [ shape.point[0] +shape.size[0] -smW, shape.point[1]+L ],
          size: [smW, smH],
          fillColor: largeFill,
        }),
        rot: 90,
      }
    }
    else if(rot==270){
      let L = shape.size[0]/RATIO
      let smH = (shape.size[1]-L)
      let smW = smH/RATIO
      return {
        shape: new Path.Rectangle({
          point: [ shape.point[0] , shape.point[1] ],
          size: [smW, smH],
          fillColor: largeFill,
        }),
        rot: 270,
      }
    }
    // Eo divide smaller
  }

  function divideSpiral({shape,rot}){
    // let spiral = new Path({
    //   strokeColor: 'blue',
    //   strokeWidth: 10,
    //   closed: false,
    // })
    var spiral 
    var smaller 

    if(rot==0){
      let L = shape.size[1]/RATIO
      let smW = shape.size[0]-L
      let smH = smW/RATIO
      let curve = (shape.size[1]-smH)
      let smCu = smH/RATIO
      spiral = new Path.Arc(
            [shape.point[0]+L, shape.point[1]+smH ],
            [shape.point[0]+L+curve/4, shape.point[1]+smH +curve/2 ],
            [shape.point[0]+L, shape.point[1]+shape.size[1] ] 
      )
      // smaller = new Path.Arc(
      //   [shape.point[0]+L, shape.point[1]+smH ],
      //   [shape.point[0]+L+smCu/2, shape.point[1]+smH+smCu/4 ],
      //   [shape.point[0]+L+smCu, shape.point[1]+smH ]
      // )
    }
    else if(rot==180){
      let L = shape.size[1]/RATIO
      let smW = shape.size[0]-L
      let smH = smW/RATIO
      let curve = shape.size[1]-smH
      let smCu = smW/RATIO
      spiral = new Path.Arc(
        [shape.point[0]+smW,shape.point[1]],
        [shape.point[0]+smW-curve/4,shape.point[1]+curve/2],
        [shape.point[0]+smW,shape.point[1]+curve],
      )
      // smaller = new Path.Arc(
      //   [shape.point[0]+smW-smCu,shape.point[1]+curve],
      //   [shape.point[0]+smW-smCu/2,shape.point[1]+curve-smCu/4],
      //   [shape.point[0]+smW,shape.point[1]+curve],
      // )
    }
    else if(rot==90){
      let L = shape.size[0]/RATIO
      let smH = shape.size[1]-L
      let smW = smH/RATIO
      let curve = shape.size[0]-smW
      spiral = new Path.Arc(
        [shape.point[0],shape.point[1]+L],
        [shape.point[0]+curve/2,shape.point[1]+L+curve/4],
        [shape.point[0] +shape.size[0]-smW,shape.point[1]+L]
      )
    }
    else if(rot==270){
      let L = shape.size[0]/RATIO
      let smH = shape.size[1]-L
      let smW = smH/RATIO
      let curve = shape.size[0]-smW
      spiral = new Path.Arc(
        [shape.point[0]+smW,shape.point[1]+smH],
        [shape.point[0]+smW+curve/2,shape.point[1]+smH-curve/4],
        [shape.point[0]+shape.size[0],shape.point[1]+smH],
      )
    }
    if(smaller){
      smaller.strokeColor = 'blue'
      smaller.strokeWidth = 5
    }
    if(spiral){  
      spiral.strokeColor = 'blue',
      spiral.strokeWidth = 5
      return spiral
    }
  }

  function createVec(ang,mag){
    return new Point(mag*Math.cos(ang),mag*Math.sin(ang))
  }

  function subDivide(){
    let newQueue = []
    queue.forEach((obj)=>{
        
      let larger = divideLarger(obj)
      let smaller = divideSmaller(obj)
      newQueue.push(larger)
      newQueue.push(smaller)
      obj.shape.fillColor = 'black'

      let spiral = divideSpiral(obj)
    })

    queue = newQueue
  }

  var queue = []

  function setup(){

    queue.push(beginRect())


    paper.view.draw();

    // * Eo setup
  }
  setup();




  view.onFrame = function(event){   
    // * Eo frame
  }


  tool.onMouseDown = function(event){
  }

  tool.onMouseDrag = function (event){
  }


  tool.onKeyDown = function(event) {
    if(event.key==='space'){
      event.preventDefault()
      subDivide();
      
    }
  }


  // * Eo window.onload
}

