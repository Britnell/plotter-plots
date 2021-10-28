/*
 *    Template for paper.js - global implementation
 */



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

  function setup(){
    var rad = 200
    
    const cStep = 0.001
    const cRad = 50
    const aStep = 0.1
    var aRad = center.y * 0.9
    const radStep = 1
    

    var background = new Path.Rectangle({
      from: [0,0],
      to: view.size,
      fillColor: 'black',
    })
    var lastRad

    var a = 0, c=0

    
      // circle.position = center
      // console.log(circle)
      var axis, p
      var squiggle = new Path({
        strokeColor: 'white',

      })

      while(aRad>15){
        
        axis = center.clone().add(static.makeVector(c,cRad))
        squiggle.add(axis.add(static.makeVector(a,aRad) ))
        
        c += cStep
        a += aStep
        aRad -= radStep


      }

  }
  setup()

  paper.view.draw();
  // * Eo window.onload
}

