/*
	subtracts shapes from each other to key unique regions
*/

paper.install(window);

window.onload = function() {
	// * Setup
	paper.setup('papercanvas');
	const tool = new Tool();
	const center = new Point(view.size.width/2,view.size.height/2)
	const statics = new PaperTool()

	// ref /folder/file.svg
	function import_svg(ref,callback){
		project.importSVG(ref,(x)=>{
			x.children[0].remove();	
			callback(x.children[0]);
		});
	}

	function get_brightness(col){
		return (col.red + col.green + col.blue)/3;
	}

	function add_to_group(group, thing){
		if(!thing.hasChildren()){
			group.addChild(thing);
		}
		else {
			thing.children.forEach((ch)=>{
				add_to_group(group,ch);
			});
		}
	}


	// **************************
	
	var m,u,d;

	function init(){
		// import svg & call main


		import_svg('/static/mud_clay_M.svg',(shape)=>{
			m = shape
			if(m && u && d)
				main()
		})
		import_svg('/static/mud_clay_U.svg',(shape)=>{
			u = shape
			if(m && u && d)
				main()
		})
		import_svg('/static/mud_clay_D.svg',(shape)=>{
			d = shape
			if(m && u && d)
				main()
		})
		
	}
	init();
	

	// *******************************

	function main(){

		m.simplify()
		u.simplify()
		d.simplify()
		
		let s = view.size.multiply(0.5)
		m.fitBounds(s)
		u.fitBounds(s)
		d.fitBounds(s)

		m.position = view.center.add([-(u.bounds.width+m.bounds.width)/2,0])
		u.position = view.center
		d.position = view.center.add([(u.bounds.width+d.bounds.width)/2,0])

		m.fullySelected = true
		u.fullySelected = true
		d.fullySelected = true
	}

	
	var muddy = []

	view.onFrame = function(ev) {
		//
		if(m && u && d)
		if(!drag.type){
			if(muddy.length==0){
				let seg = m.segments[2]
				muddy.push({ 
					x:0 ,  f: 30, mag: 15,
					seg: seg,
					in: seg.handleIn.angle,
					out: seg.handleOut.angle,
				})
				seg = u.segments[5]
				muddy.push({ 
					x: 0 ,  f: 20, mag: 10,
					seg: seg,
					in: seg.handleIn.angle,
					out: seg.handleOut.angle,
				})
				seg = d.segments[3]
				muddy.push({ 
					x: 0 ,  f: 25, mag: 15,
					seg: seg,
					in: seg.handleIn.angle,
					out: seg.handleOut.angle,
				})
			}
			else {
				muddy.forEach((mud)=>{
					mud.seg.handleIn.angle  =  mud.in + Math.sin(mud.x/mud.f) * mud.mag
					mud.seg.handleOut.angle = mud.out + Math.sin(mud.x/mud.f) * mud.mag
					mud.x++
				})
			}
		}
	}

	var drag = {}


	tool.onMouseDown = function(ev){

		drag = get_closest(ev.point)
		muddy = []

	}

	function other_handle(handle){
		return (handle==='handleIn')?'handleOut':'handleIn'
	}
	tool.onMouseDrag = function(ev){
		// console.log()
		if(drag.type==='point'){
			drag.seg.point = ev.point
		}
		else {	
			// * Handles
			drag.seg[drag.type] = ev.point.subtract(drag.seg.point)
			let other = other_handle(drag.type)
			// console.log(drag.seg[drag.type].angle, drag.seg[other].angle)
			drag.seg[other].angle = drag.seg[drag.type].angle+180
		}
	}

	tool.onMouseUp = function(ev){
		drag = {}
	}

	function handle_pos(seg,handle){
		return seg.point.add(seg[handle])
	}

	function shapes_closest(shape,pos,closest){
		shape.segments.forEach((seg,i)=>{
			let dist = pos.subtract(seg.point).length
			if(dist<closest.dist){
				closest.dist = dist
				closest.type = 'point'
				closest.seg = seg
			}
			dist = pos.subtract(handle_pos(seg,'handleIn')).length
			if(dist<closest.dist){
				closest.dist = dist
				closest.type = 'handleIn'
				closest.seg = seg
			}
			dist = pos.subtract(handle_pos(seg,'handleOut')).length
			if(dist<closest.dist){
				closest.dist = dist
				closest.type = 'handleOut'
				closest.seg = seg
			}
		})
	}

	function get_closest(pos){
		var closest = { dist: 5000	}
		shapes_closest(m,pos,closest)
		shapes_closest(u,pos,closest)
		shapes_closest(d,pos,closest)		
		return closest;
	}

	function closest_point_to(pos,shape){
		let closest = { dist: 1000 }
		shape.segments.forEach((seg)=>{
			let dist = seg.point.subtract(pos).length
			if(dist<closest.dist){
				closest.dist = dist;
				closest.point = seg.point
			}
		})
		return closest
	}

	
	function linear(x,xmin,xmax, ymin,ymax){
		let r = (x-xmin)/(xmax-xmin);
		return ymin + r * (ymax-ymin);
	}

	function limit(x,xmin,xmax){
		if(x<xmin)
			x = xmin;
		else if(x>xmax)
			x = xmax;
		return x;
	}
	
	view.draw();
}


// Here is a way with JS		https://www.mikechambers.com/blog/2014/07/01/saving-svg-content-from-paper.js/
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

