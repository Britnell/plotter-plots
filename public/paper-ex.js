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
  static.exportButton()
  
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
    
  }
  setup()

  paper.view.draw();
  // * Eo window.onload
}

