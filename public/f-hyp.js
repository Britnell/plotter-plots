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
  const cnvs = view.size

  view.onFrame = function(event){   
      // * Loop
  }

  tool.onMouseDown = function(event){
    // if(event.event.button==0)
  }

  tool.onMouseDrag = function (event){
  }


  tool.onKeyDown = function(event) {
    // console.log(event.key)
    if(event.key==='up'){
      gruppe.scale(1.1,center)
      event.preventDefault()
    }
    else if(event.key==='down'){
      gruppe.scale(0.9,center)
      event.preventDefault()
    }
  }

  var SCALE;
  var gruppe;

  function draw_curve(f){
    let path = new Path({
      strokeColor: 'black',
    })

    for(let x=-2*SCALE; x<2*SCALE; x+=1){
      let y = f(x)
      let px = static.linear(x,-SCALE,SCALE,0,cnvs.width)
      let py = static.linear(y,-SCALE,SCALE,cnvs.height,0)
      if( py>-2*cnvs.height && py <3*cnvs.height)
        path.add([px,py])
    }
    return path
  }

  function hyperboles(){
    SCALE = 2000
    let curves = 20
    for(let i=0;i<curves;i++){
      let m = static.linear(i,0,curves, 10, 4000 )
      let C = static.expon_i(i,2,0,curves, -0.8*SCALE, 0.2*SCALE )
      let p = draw_curve((x)=>(x*x)/m +C)
      gruppe.addChild(p)
    }
  }

  function hyperboles2(){

    SCALE = 2000
    let curves = 20

    for(let i=0;i<curves;i++){
      let m = static.expon(i,0,curves, 10, 4000 )
      let C = static.expon_i(i,2,0,curves, -1800, 200 )
      let p = draw_curve((x)=>(x*x)/m +C)
      gruppe.addChild(p)
    }
  }

  function hyperboles3(){
    SCALE = 2000
    let curves = 20

    for(let i=0;i<curves;i++){
      let m = static.expon(i,0,curves, 20, 4000 )
      let C = static.linear(i,0,curves, -1200, -1900 )
      let p = draw_curve((x)=>(x*x)/m +C)
      gruppe.addChild(p)
    }
  }

  function setup(){
    gruppe = new Group()

    hyperboles()
    // hyperboles2()
    // hyperboles3()
    paper.view.draw();

  }

  setup()
  // static.exportButton()

  // * Eo window.onload
}

