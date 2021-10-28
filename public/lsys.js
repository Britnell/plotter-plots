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
    next.rotate(rule.dir,p)
    next.scale(rule.prop,p)
    if(rule.col)
      next.strokeColor = rule.col
    return next;
  }

  function setup(){
    
    const sizer = center.y *0.5 // length of inital path
    const gens = 8    // number of iterations / repitions of growing ~ density

    // the first path will grow new branches : 
    // at a position along the path [0-1]
    // in a direction, -90=L, 90=R  [ deg ]
    // proportion of size of the new branch compared to path [0-1]
    const growth = [
      {   pos: 0.68,    dir:  70,   prop: 0.65 },
      {   pos: 0.58,    dir: -80,   prop: 0.65 },
      // {   pos: 1,    dir: -5,   prop: 0.3 },
    ]
    
    var shape = new Path({
      strokeColor: 'black',
    })
    shape.add([center.x,center.y+sizer])
    shape.add([center.x+10,center.y])
    shape.add([center.x,center.y-sizer])
    shape.simplify()

    var branches = [shape]
    var nextBranches = []
    // Repeat x times / generations
    for(let x=0; x<gens; x++){
      // for each branch
      branches.forEach((branch)=>{
        // create each growth
        growth.forEach((g)=>{
          let next = grow_branch(branch,g)        
          nextBranches.push(next)
        })
        // branch.strokeColor = null
      })
      branches = nextBranches
      nextBranches = []
    }

    branches.forEach((bch)=>{
      // bch.strokeColor = 'green';bch.strokeWidth = 2
      dot({center: bch.lastSegment.point, radius: 1, })
    })
    
    // Ep setup
  }
  setup()


  paper.view.draw();
  // * Eo window.onload
}


const g1 = [
  {   pos: 0.22,    dir: -60,    prop: 0.28 },
  {   pos: 0.38,    dir: 60,    prop: 0.28 },

  {   pos: 0.58,    dir: 45,    prop: 0.4 },
  {   pos: 0.51,    dir: -59,   prop: 0.45 },
  
  {   pos: 0.82,    dir: -45,   prop: 0.38 },
  {   pos: 0.92,    dir: 38,   prop: 0.28 },
  
  {   pos: 1,    dir: -5,   prop: 0.3 },
]