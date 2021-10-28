

class PaperTool{
    constructor(){
    }

    limit(x,min,max){
      if(x<min) return min;
      if(x>max) return max;
      return x;
    }
    linear(x,min,max,omin,omax){
        let prop = (x-min)/(max-min)
        return omin + prop * (omax-omin)
    }
    expon(x,exp,min,max,omin,omax){
        let prop = (x-min)/(max-min)
        return omin + Math.pow(prop,exp) * (omax-omin)
    }
    expon_i(x,exp,min,max,omin,omax){
        let prop = ((max-min)-(x-min))/(max-min)
        return omin + (1-Math.pow(prop,exp) ) * (omax-omin)
    }

    random(min,max){
        return min + (max-min)*Math.random()
    }
    randomPoint(size){
        let W,H
        if(size.hasOwnProperty('x'))    W = size.x
        else                            W = size.width
        if(size.hasOwnProperty('y'))    H = size.y
        else                            H = size.height
        let x = Math.random()*W
        let y = Math.random()*H
        return new Point(x,y)
    }

    randomPointFrom(center,radius){
        let ang = Math.random()*2*Math.PI
        let rad = Math.random()*radius
        let x = center.x + rad * Math.cos(ang)
        let y = center.y + rad * Math.sin(ang)
        return new Point(x,y)         
    }

    randomColor(){
      return new Color({
        hue: this.random(0,360),
        saturation: this.random(0.5,0.9),
        brightness: this.random(0.5,1),
      })
    }

    getDistance(p1,p2){
        let x=p1.x -p2.x
        let y=p1.y -p2.y
        return Math.sqrt(x*x+y*y)
    }

    makeVector(angle,mag){
        return new Point(mag*Math.cos(angle),mag*Math.sin(angle))
    }

    clearGroup(group){
        group.children.forEach((child)=>{
            child.remove()
        })
        group.removeChildren()
    }

    remove_from_list(list,el){
      let i = list.indexOf(el)
      if(i!=-1)
        list.splice(i,1)
      return list
    }

    smallest(list){
      let sm = 0
      for(let x=1;x<list.length;x++){
        if(list[x]<list[sm])
          sm = x
      }
      return sm
    }
    
    exportButton(){
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
    }

    dot(options={}){
        return new Path.Circle({
            center: [0,0],
            radius:2,
            fillColor: 'blue',
            ...options
        })
    }
}


