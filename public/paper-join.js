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
    var gr = new Group()
    
    gr.addChild(new Path.Line({
      from: [0,0],
      to: [50,50],
      strokeColor: 'black',
      selected: true,
    }))
    gr.addChild(new Path.Arc({
      from: center,
      through: center.add(new Point(0,50)),
      to: center.add(new Point(0.01,0)),
      strokeColor: 'black',
      fullySelected: true,
    }))
    
    // gr.addChild(new Path.Line({
    //   from: center,
    //   to: center.clone().add(static.makeVector(0,50)),
    //   strokeColor: 'black',
    //   selected: true,
    // }))
    // gr.addChild(new Path.Line({
    //   from: center,
    //   to: center.clone().add(static.makeVector(Math.PI,50)),
    //   strokeColor: 'black',
    //   selected: true,
    // }))

    let junc = gr.hitTestAll(center)
    console.log(' junction : ', junc )
    join_junction(junc)

    console.log(' group after: ', gr)
		
    
    // Eo setup
  }
  setup()

  paper.view.draw();
  // * Eo window.onload
}

