/*
 *    Template for paper.js - global implementation
 */



paper.install(window);

window.onload = function() {
  
  // * Setup

  paper.setup('papercanvas');
  const tool = new Tool();
  const static = new PaperTool()
  const voronoi = new Voronoi();
  const center = new Point(view.size.width/2, view.size.height/2)
  
  view.onFrame = function(event){   
      // * Loop
      draw_petals(frac)
  }

  tool.onKeyDown = (ev)=>{
    ev.preventDefault()
    if(ev.key==='up')
      frac += 0.0005
    else if(ev.key==='down')
      frac -= 0.0005
    else if(ev.key==='left')
      frac -= 0.0001
    else if(ev.key==='right')
      frac += 0.0001
    
  }
  tool.onMouseDrag = function(event){
    let x = ( Math.abs(event.delta.x) >1 ) ? event.delta.x : 0
    let y = ( Math.abs(event.delta.y) >1 ) ? event.delta.y : 0
    frac += ( y + x /10) / 1000
    // frac = (event.point.x  + event.point.y ) / ( view.size.width + view.size.height );
  }

  // * PETALS

  var frac = 1.61803398874989
  var step = 1
  var Rbegin = 5
  var RADIUS = view.size.height*0.8

  var petals = new Group()
  var label = new PointText({
    point: [20,20],
    content: frac.toString(),
    fontSize: 20,
  })

  var points = []
  var voroniGroup = new Group()

  function drawVoronoi(){
    
    static.clearGroup(voroniGroup)

    var voroni = voronoi.compute(points,{
      xl: 0,  xr: view.size.width,
      yt: 0,  yb: view.size.height
    })
    voroni.cells.forEach((cell)=>{
      let outl = new Path()
      cell.halfedges.forEach((half)=>{
				outl.join( new Path.Line({
					from: half.edge.va,
					to: half.edge.vb
				}));
			});
      voroniGroup.addChild(outl)
      // Eo for each cell
    })
    voroniGroup.strokeColor = 'blue'

  }
  function draw_petals(){
    // Clear
    static.clearGroup(petals)

    label.content = frac.toString()

    let ang = 0
    points = []

    for(let r=Rbegin; r<RADIUS; r+=step){
      let p = center.add(static.makeVector(ang,r))
      points.push(p)
      let dot = static.dot({
        center: p,
        radius: static.linear(r,0,RADIUS, 3,24 ),
        strokeColor: 'blue',
        fillColor: null,
      })
      petals.addChild(dot)
      ang += frac * Math.PI * 2
    }

    // * Voronoi 
    // drawVoronoi()


    // Eo draw
  }

  function setup(){
    static.exportButton()

    draw_petals()

  }
  setup()

  paper.view.draw();
  // * Eo window.onload
}

