/*
 *    Template for paper.js - global implementation
 */

paper.install(window);

window.onload = function() {
  
    // * Setup

  paper.setup('papercanvas');
  var tool = new Tool();
  var center = new Point(view.size.width/2,view.size.height/2)

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

  // *********************************

  function linearSpiral(){
    // nada
  }

  function staticDraw({angBegin=0 ,radBegin=4, res=0.1, radius, spoke}){
    
    var spiral = new Path({
      closed: false,
      strokeColor: 'black',
    })

    let ang = angBegin;
    let rad = radBegin;

    let spokePerRad = spoke/2/Math.PI
    
    // for(let x=0;x<100;x++){
    while(rad<radius){
      let x = center.x+ rad*Math.cos(ang)
      let y = center.y+ rad*Math.sin(ang)
      spiral.add([x,y])

      ang += res
      rad += res*spokePerRad
    }

    spiral.smooth()

    //
  }

  staticDraw({
    radius: 200,
    radBegin: 1,
    spoke: 20,
    res: 0.3,
  });
  staticDraw({
    radius: 200,
    radBegin: 1,
    angBegin: Math.PI,
    spoke: 20,
    res: 0.3,
  });

  paper.view.draw();

  // * Eo window.onload
}

