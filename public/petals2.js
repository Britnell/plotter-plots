/*
 *    Template for paper.js - global implementation
 */



paper.install(window);

var redraw = true;
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
    redraw = true
    if(ev.key==='up')
      frac += 0.00005
    else if(ev.key==='down')
      frac -= 0.00005
    else if(ev.key==='left')
      frac -= 0.0005
    else if(ev.key==='right')
      frac += 0.0005
    else 
      random_leaf()
  }
  tool.onMouseDrag = function(event){
    let x = ( Math.abs(event.delta.x) >1 ) ? event.delta.x : 0
    let y = ( Math.abs(event.delta.y) >1 ) ? event.delta.y : 0
    frac += ( y + x /10) / 1000
    redraw = true
    // frac = (event.point.x  + event.point.y ) / ( view.size.width + view.size.height );
  }

  // * PETALS

  var frac = 1.61803398874989
  var step = 1
  var Rbegin = 2
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
    if(!redraw)
      return;
    
    // Clear
    static.clearGroup(petals)

    label.content = frac.toString()

    let ang = 0
    points = []

    for(let r=Rbegin; r<RADIUS; r+=step){
      let p = center.add(static.makeVector(ang,r).multiply(2))
      points.push(p)
      let lf = leaf.shape.clone()
      lf.position = p
      lf.rotate(ang*180/Math.PI + leaf.dir)
      // lf.rotate(r)
      // lf.rotate(ang)
      lf.scale(static.linear(r,0,RADIUS, 0.06,0.8 ) )
      lf.strokeColor = 'blue'
      petals.addChild(lf)
      ang += frac * Math.PI * 2
    }

    redraw = false
    // * Voronoi 
    // drawVoronoi()
    // Eo draw
  }

  const leaf = {};

  
	function draw_leaf(p, len, fatness, lopside, shape)
	{
		var leaf = new Path({});

		let widt = len*fatness;
		shape *= len;

		let tipHandle;
		if(shape>  (1-lopside)*len) tipHandle = (1-lopside)*len;
		else    tipHandle = shape;

		// from stem
		let stem = p.clone();
		leaf.add(stem);

		let Rside = p.clone().add([(widt/2),(len*lopside)]);
		leaf.add( new Segment(Rside, new Point(0,-shape), new Point(0,tipHandle) ) );

		let tip = p.clone().add([0,len]);;
		leaf.add(tip);
    
		let Lside = p.clone().add([-(widt/2),(len*lopside)]);
		leaf.add( new Segment(Lside, new Point(0,tipHandle), new Point(0,-shape) ) );//.selected = true;
		
		leaf.add(stem);

		return leaf;
	}

  function random_leaf(){
    // * Leaf
    let len = 100
    let fat = static.random(0.3,0.8);		// proportion width to length
    let lop = static.random(0.2,0.8);  // asymmetry of leaf
    let sha = static.random(0.1,0.9);	// controls curve handle
    let col = static.randomColor();
    let p = new Point(100,100)
    leaf.dir = static.random(0,360)
    if(leaf.shape)    leaf.shape.remove()
    leaf.shape = draw_leaf(p,len,fat,lop,sha)
  }

  function setup(){
    static.exportButton()
    
    // create new random leaf
    random_leaf()

    draw_petals()

  }
  setup()

  paper.view.draw();
  // * Eo window.onload
}

