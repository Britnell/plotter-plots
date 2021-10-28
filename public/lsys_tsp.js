/*
 *    Template for paper.js - global implementation
 */


// import '/lib/index.js'

paper.install(window);

window.onload = function() {
  
    // * Setup

  paper.setup('papercanvas');
  const tool = new Tool();
  const statics = new PaperTool()
  const center = new Point(view.size.width/2, view.size.height/2)
  statics.exportButton()
  
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


  function dot(props){
    return new Path.Circle({
      center: center,
      radius: 4,
      fillColor: 'blue',
      ...props
    })
  }

  
  function get_TxVec(path){
    return path.position.subtract(path.firstSegment.point)
  }

  function grow_branch(branch,rule){
    
    let off = rule.pos * branch.length  
    let p = branch.getPointAt(off)
    let ang = branch.getTangentAt(off)
    let TxVec = get_TxVec(branch)
    
    let next = branch.clone()
    next.position = p.add(TxVec)
    next.rotate(rule.dir+statics.random(-ruffle,ruffle),p)
    next.scale(rule.prop,p)
    if(rule.col)
      next.strokeColor = rule.col
    return next;
  }

  
	function draw_leaf(p, len, fatness, lopside, shape)
	{
		var leaf = new Path({
			// selected: true
		});

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

  function add_leaves(branch,rules){
    rules.forEach((rule)=>{
      let off = rule.pos * branch.length
      let p = branch.getPointAt(off)
      let ang = branch.getTangentAt(off)
      let baby = leaf.clone()
      baby.position = p.add(get_TxVec(baby))
      // let scle = rule.prop*branch.length/leaf.len
      // scle = statics.limit(scle,0.1,0.3)
      baby.scale( rule.prop, p)
      baby.rotate(rule.dir+ang.angle-90,p)
    })
  }

	
  const sizer = center.y *0.5 // length of inital path
  const gens = 3
  const N = 16
  const ruffle = 1
  

  var leaf, leafVec;

  function setup(){
    
    
    const growth = []
    const leaves = []

    growth.push({ pos: 0.3, dir: -80, prop: 0.5 })
    growth.push({ pos: 0.5, dir: 90, prop: 0.5 })
    growth.push({ pos: 0.65, dir: -70, prop: 0.4 })
    growth.push({ pos: 0.8, dir: 60, prop: 0.3 })
    growth.push({ pos: 1, dir: 6, prop: 0.26 })

    
    // * path
    var shape = new Path({
      strokeColor: 'black',
    })
    shape.add([center.x,center.y+sizer])
    shape.add([center.x+14,center.y])
    shape.add([center.x,center.y-sizer])
    shape.simplify()

    
    var branches = [shape]
    var nextBranches = []
    var tree = new Group()
    tree.addChild(shape)
    var dots = []

    // Repeat x times / generations
    for(let x=0; x<gens; x++){
      // for each branch
      branches.forEach((branch)=>{
        // create each growth
        growth.forEach((g)=>{
          let next = grow_branch(branch,g)
          nextBranches.push(next)
          tree.addChild(next)
        })
        // branch.strokeColor = null
      })
      branches = nextBranches
      nextBranches = []
    }

    // tree.strokeColor = null

    tree.children.forEach((pth)=>{
      add_leaves(pth,leaves)
      // dots.push(pth.firstSegment.point)
      // dots.push(pth.lastSegment.point)
    })

    // dots.forEach((p)=> dot({center: p, radius: 1, fillColor: 'red' })  )

    // Last gen of branches
    branches.forEach((bch)=>{
      // bch.strokeColor = 'green';bch.strokeWidth = 2
      // dot({center: bch.lastSegment.point, radius: 1, })
    })

    
    // Ep setup
  }
  setup()


  paper.view.draw();
  // * Eo window.onload
}

// * LEAVES
// let L = 5
// for(let x=0;x<L;x++){
//   let sides = (x%2==0)?1:-1
//   leaves.push({
//     pos: statics.linear(x,0,L,0.1,1),
//     dir: 90*sides,
//     prop: 0.1
//   })
// }
// leaves.push({ pos: 1, dir: 5, prop: 0.1 })
// leaves.push({ pos: 0.4, dir: -15, prop: 0.1 })


// * Leaf
// let len = 100
// let fat = statics.random(0.3,0.8);		// proportion width to length
// let lop = statics.random(0.2,0.8);  // asymmetry of leaf
// let sha = statics.random(0.2,0.8);	// controls curve handle
// let col = statics.randomColor();

// let p = new Point(100,100)
// leaf = draw_leaf(p,len,fat,lop,sha)
// leafVec = p.subtract(leaf.position)

// leaf.fillColor = col
// leaf.len = len


const g1 = [
  {   pos: 0.22,    dir: -60,    prop: 0.28 },
  {   pos: 0.38,    dir: 60,    prop: 0.28 },

  {   pos: 0.58,    dir: 45,    prop: 0.4 },
  {   pos: 0.51,    dir: -59,   prop: 0.45 },
  
  {   pos: 0.82,    dir: -45,   prop: 0.38 },
  {   pos: 0.92,    dir: 38,   prop: 0.28 },
  
  {   pos: 1,    dir: -5,   prop: 0.3 },
]

// * fern
// growth.push({pos:1, dir:-5, prop: 0.1})
// for(let x=0;x<N; x++){
//   let s = (x%2==0)?1:-1

//   growth.push({
//     pos: statics.expon_i(x,1.6,1,N,0.2,1) ,// +statics.random(-0.01,0.01),
//     dir: s *statics.random(75,78) ,
//     prop: statics.expon_i(x,1.6,0,N-1,0.35,0.08),
//   })
// }