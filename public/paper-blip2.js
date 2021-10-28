/*
 *    Template for paper.js - global implementation
 */


function downloadDataUri(options) {
  if (!options.url)
    options.url = "http://download-data-uri.appspot.com/";
  $('<form method="post" action="' + options.url
    + '" style="display:none"><input type="hidden" name="filename" value="'
    + options.filename + '"/><input type="hidden" name="data" value="'
    + options.data + '"/></form>').appendTo('body').submit().remove();
}

$('#export-button').click(function() {
  // http://paperjs.org/reference/project/#exportsvg
  let export_options = {
    'bounds': 'view',	// 'content' uses outer stroke bounds
    'precision' : 5,	// amount of fractional digits in numbers used in SVG data 
    'asString': true 
  }
  var svg = project.exportSVG(export_options);
  downloadDataUri({
    data: 'data:image/svg+xml;base64,' + btoa(svg),
    filename: 'export.svg'
  });
});

paper.install(window);

window.onload = function() {
  
    // * Setup
  paper.setup('papercanvas');
  
  const tool = new Tool();
  const static = new PaperTool()
  const center = new Point(view.size.width/2, view.size.height/2)
  var step = static.random(5,25)
  var circles;
  var squiggles = new Path()
  var drawBegin = 0
  var paused = true;
  var angleStep = 0.1
  var pathStep = 0.3
    
  const beg = {
    pos: static.randomPointFrom(center,200),
    radius: static.random(100,300),
  }
  const via = {
    pos: center.clone(),
  }
  const end = {
    pos: static.randomPointFrom(center,200),
    radius: static.random(10,80),
  }
  var arc = new Path({});

  const dragger = {
    status: '',
    target: null,
  }
  
  view.onFrame = function(event){   
      // * Loop
      if(!paused){
        drawBegin += 0.2
        if(drawBegin>step)  drawBegin = 0
        drawItAll()
      }
  }

  tool.onMouseDown = function(event){
    //
    let b = static.getDistance(event.point,beg.pos) -beg.radius
    let e = static.getDistance(event.point,end.pos) -end.radius

    if(Math.abs(b)<5){
      dragger.target = beg
    }
    else if(Math.abs(e)<5){
      dragger.target= end
    }
    // console.log(event.point,b,)
  }

  tool.onMouseDrag = (ev)=>{
    // drag circle sizes
    if(dragger.target)
    {
      let d = static.getDistance(ev.point,dragger.target.pos) 
      d = Math.floor(d)
      let prop = d/dragger.target.radius 
      dragger.target.circle.scale(prop)
      dragger.target.radius = d

      drawItAll()
    }
  }

  
  tool.onMouseUp = ()=>{
    if(dragger.target){
      dragger.target = null
    }
  }


  tool.onKeyDown = function(event) {
    if(event.key=='space'){
      paused = !paused
    }
  }

  function drawItAll(){
    // drawWithCircles()
    drawWithSquiggle()
  }

  function drawWithCircles(){
    
    static.clearGroup(circles)

    arc.remove()
    // * ARC
    arc = new Path.Arc({
      from: beg.pos,
      through: via.pos,
      to: end.pos,
      strokeColor: 'orange',
    })
    // * PATH
    // arc = new Path({
    //   segments: [beg.pos,via.pos,end.pos],
    //   strokeColor: 'orange',
    // })
    // arc.simplify()
    //

    for(let x=drawBegin;x<arc.length; x+= step){
      let rad = static.linear(x,0,arc.length, beg.radius,end.radius)
      let p = arc.getPointAt(x)
      circles.addChild( new Path.Circle({
        center: p,
        radius: rad,
        strokeColor: 'black',
      }) )
    }
    
    // Eo draw
  }

  
  function drawWithSquiggle(){
    
    squiggles.remove()
    squiggles = new Path({
      strokeColor: 'black',
    })
    
    arc.remove()
    // * ARC
    arc = new Path.Arc({
      from: beg.pos,
      through: via.pos,
      to: end.pos,
      strokeColor: 'orange',
    })

    var a =0;
    for(let p=0;p<arc.length; p+= pathStep){
      
      let rad = static.linear(p,0,arc.length, beg.radius,end.radius)
      let ctr = arc.getPointAt(p)
      let x = ctr.x + rad * Math.cos(a)
      let y = ctr.y + rad * Math.sin(a)

      squiggles.add([x,y])
      
      a += angleStep
    }
    // squiggles.simplify()
    
    // Eo draw
  }

  function dragPoint(obj,pos){
    obj.pos = pos
    obj.marker.position = pos
    if(obj.hasOwnProperty('circle'))
      obj.circle.position = pos 
    drawItAll()
  }

  function start(){
    // center markers
    beg.marker = new Path.Circle({
      center: beg.pos,
      radius: 10,
      fillColor: 'yellow',
    })
    via.marker = new Path.Circle({
      center: via.pos,
      radius: 10,
      fillColor: 'orange',
    })
    end.marker = new Path.Circle({
      center: end.pos,
      radius: 10,
      fillColor: 'red',
    })
    // * Circles
    beg.circle = new Path.Circle({
      center: beg.pos,
      radius: beg.radius,
      strokeColor: 'yellow',
    })
    end.circle = new Path.Circle({
      center: end.pos,
      radius: end.radius,
      strokeColor: 'red',
    })
    // * Events
    beg.marker.onMouseDrag = (ev)=>dragPoint(beg,ev.point)
    via.marker.onMouseDrag = (ev)=>dragPoint(via,ev.point)
    end.marker.onMouseDrag = (ev)=>dragPoint(end,ev.point)

    // * Step changer
    var stepscale = 100
    var stepper = {
      line: new Path.Line({
        from: [10,10],
        to: [10+pathStep*stepscale,10],
        strokeColor: 'blue',
      }),
      marker: new Path.Circle({
        center: [10+pathStep*stepscale,10],
        radius: 8,
        fillColor: 'blue',
      })
    }
    stepper.marker.onMouseDrag = (ev)=>{
      let d = ev.point.x-10
      pathStep = d/stepscale
      stepper.marker.position.x = ev.point.x
      stepper.line.lastSegment.point.x = ev.point.x
      drawItAll()
    }

    circles = new Group()
    circles.sendToBack()
    drawItAll()
  }
  start();
  paper.view.draw();
  
  // * Eo window.onload
}

