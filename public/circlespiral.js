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
    const radStep = 5.5
    const aStep = 0.21
  
    var background = new Path.Rectangle({
      from: [0,0],
      to: view.size,
      fillColor: 'black',
    })
    var lastRad, rad = (center.y+center.x)/3 * 0.9

    var a = 0

    var circle = new Path.Circle({
        position: center,
        radius: rad,
        strokeColor: 'white',
      })
      // circle.position = center
      // console.log(circle)

      while(rad>15){
        lastRad = rad
        rad -= radStep

        circle = new Path.Circle({
          position: circle.position.add(static.makeVector(a,radStep)),
          radius: rad,
          strokeColor: 'white',
        })

        a += aStep
      }

  }
  setup()

  paper.view.draw();
  // * Eo window.onload
}

