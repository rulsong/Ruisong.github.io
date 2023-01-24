"use strict"

let svgWidth=800
let svgHeight=600

let drawing = d3.select("#canvas")
    .append("svg") 
    .attr("width", svgWidth)
    .attr("height",svgHeight)

let border=drawing.append("rect")
    .attr("width",svgWidth)
    .attr("height",svgHeight)
    .attr("fill","#ebd8b7")

let leftCircle=drawing.append("circle")
    .attr("cx",200)
    .attr("cy",100)
    .attr("r",20)
    .attr("fill","black")

let leftCircleSec=drawing.append("circle")
    .attr("cx",200)
    .attr("cy",100)
    .attr("r",10)
    .attr("fill","white")

let leftCircleThi=drawing.append("circle")
    .attr("cx",200)
    .attr("cy",100)
    .attr("r",5)
    .attr("fill","black")


let midTriangle=drawing.append("polyline")
    .attr("points",closedPolygon(330,50,300,550,650,400))
    .attr("fill","#fcec64")
    .attr("stroke","none")


let leftLine=drawing.append("line")
    .attr("x1",100)
    .attr("y1",50)
    .attr("x2",350)
    .attr("y2",30)
    .attr("stroke","black")
    .attr("stroke-width",2)

let leftPolyline=drawing.append("polyline")
    .attr("points",closedPolygon(150,40,180,70,250,47,200,20))
    .attr("fill","none")
    .attr("stroke","black")

let topTriangle=drawing.append("polyline")
    .attr("points",closedPolygon(450,100,510,110,480,60))
    .attr("fill","darkred")
    .attr("stroke","none")

let leftPolylineSec=drawing.append("polyline")
    .attr("points",closedPolygon(50,300,200,230,330,250,150,550))
    .attr("fill","brown")
    .attr("stroke","none")

let rightCircle=drawing.append("circle")
.attr("cx",600)
.attr("cy",300)
.attr("r",150)
.attr("fill","darkbrown")

let leftCircleFir=drawing.append("circle")
.attr("cx",100)
.attr("cy",200)
.attr("r",40)
.attr("fill","darkblue")

let leftCircleThir=drawing.append("circle")
.attr("cx",80)
.attr("cy",180)
.attr("r",3)
.attr("fill","blue")

let leftCircleFour=drawing.append("circle")
.attr("cx",95)
.attr("cy",190)
.attr("r",5)
.attr("fill","yellow")

let leftLineFir=drawing.append("line")
    .attr("x1",40)
    .attr("y1",250)
    .attr("x2",160)
    .attr("y2",150)
    .attr("stroke","black")
    .attr("stroke-width",3)

let bigLine=drawing.append("line")
    .attr("x1",40)
    .attr("y1",580)
    .attr("x2",650)
    .attr("y2",30)
    .attr("stroke","black")
    .attr("stroke-width",3)

let rightArc=drawing.append("path")
    .attr("transform",`translate(200,450)`)
    .attr("d",d3.arc().innerRadius(35).outerRadius(60).startAngle(5.8).endAngle(7))
    .attr("fill","red")

let rightArcSec=drawing.append("path")
    .attr("transform",`translate(200,450)`)
    .attr("d",d3.arc().innerRadius(35).outerRadius(60).startAngle(7.2).endAngle(8))
    .attr("fill","#35069d")

let rightArcThi=drawing.append("path")
    .attr("transform",`translate(200,450)`)
    .attr("d",d3.arc().innerRadius(35).outerRadius(60).startAngle(8.4).endAngle(9.3))
    .attr("fill","#591d03")



