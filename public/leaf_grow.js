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
    
    const sizer = center.y * 0.8

    var line = new Path({
      strokeColor: 'blue',
    })
    line.add([center.x,center.y+sizer])
    line.add([center.x+10,center.y])
    line.add([center.x,center.y-sizer])
    line.smooth()

    var outl = new Path.Circle({
      center: center,
      radius: sizer,
      strokeColor: 'blue',
    })

    var growths = []
    var leaf = new Group()

    const N = 50

    for(let i=0; i<N; i++){
      let off = static.linear(i, -1,N, 0, line.length )
      let p = line.getPointAt(off)
      growths.push({
        pos: p,
        dir: line.getTangentAt(off).rotate(-90).multiply(5),
        path: new Path({
          strokeColor: 'black',
          segments: [p],
          // selected: true,
        })
      })
      growths.push({
        pos: p,
        dir: line.getTangentAt(off).rotate(90).multiply(5),
        path: new Path({
          strokeColor: 'black',
          segments: [p],
          // selected: true,
        })
      })
    }

    // for(let i=0;i<20;i++){
    while(growths.length>0){
      let i=0
      while(i<growths.length){
          let g = growths[i]
          let p = g.pos.add(g.dir)
          if(outl.contains(p)){
            g.pos = p
            g.path.add(p)
            i++;     
          }
          else {
            g.path.simplify()
            growths.splice(i,1)
            break;
          }
      }
      
    }

    // Ep setup
  }
  setup()


  paper.view.draw();
  // * Eo window.onload
}

function nearest_growth(list,pos){
  if(list.length==1)
    return {x:0,y:0};

  let nearest;
  list.forEach((l)=>{
    let vec = pos.subtract(l.pos)
    let dist = vec.length
    if(dist!==0){
      if(!nearest){
        nearest = vec
      }
      else if(dist<nearest.length){
        nearest = vec
      }
    }
  })
  // console.log(' nearest ', nearest )
  return nearest
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