/* eslint react/prefer-es6-class: "off", max-len: "off" */
import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import d3Drag from 'd3-drag';
import Faux from 'react-faux-dom';

// Can't use ES6 because Faux needs mixins too work.
const DatamodelGraph = React.createClass({
  propTypes: {
    bars: PropTypes.object.isRequired,
    line: PropTypes.object.isRequired,
    manipulableLine: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  },

  mixins: [
    Faux.mixins.core,
    Faux.mixins.anim
  ],

  getInitialState() {
    return {
      chart: 'loading...'
    };
  },

  componentWillMount() {
    // this.props.init();
  },

  componentWillReceiveProps(nextProps) {
    const { onChange, bars, line, manipulableLine, width, height } = nextProps;

    const faux = this.connectFauxDOM('div.renderedD3', 'chart');
    // set the dimensions and margins of the diagram
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    const svg = d3.select(faux).append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    var barWidth = 15;

    var x = d3.scaleLinear().domain([0, bars.length]).range([0, width]);
    var y = d3.scaleLinear().domain([d3.min(bars, function(datum) { return datum.yield; }), d3.max(bars, function(datum) { return datum.yield; })]);

    const max = Math.max(0, ...bars.map(p => p.yield));
    const min = Math.min(0, ...bars.map(p => p.yield));

    const scale = height / (max - min);
    const zero = height * max / (max - min);

    console.log('line', line, 'manipulableLine', manipulableLine);

    svg.selectAll("rect").
      data(bars).
      enter().
      append("svg:rect").
      attr("x", function(datum, index) { return x(index); }).
      attr("y", function(datum) { return datum.yield > 0 ? zero - scale*datum.yield : zero; }).
      attr("height", function(datum) { return scale*Math.abs(datum.yield); }).
      // attr("y", function(datum) { return 0; }).
      // attr("height", function(datum) { return height/2; }).
      attr("width", barWidth).
      attr("fill", datum => datum.yield > 0 ? "#2d578b" : "#ff0000");

    // Draw line
    //Draw the line
    svg.append("line")
      .attr("x1", x(0) )
      .attr("y1", zero - scale*(line[0] - line[1]*9))
      .attr("x2", x(bars.length))
      .attr("y2", zero - scale*line[0])
      .attr("stroke-width", 2)
      .attr("stroke", "black");

    svg.append("line")
      .attr("x1", x(0) )
      .attr("y1", zero - scale*(manipulableLine[0] - manipulableLine[1]*9))
      .attr("x2", x(bars.length))
      .attr("y2", zero - scale*manipulableLine[0])
      .attr("stroke-width", 2)
      .attr("stroke", "black");

    // console.log('d3Drag', d3Drag);
    // var drag = d3Drag.drag()
    //   .on('dragstart', null)
    //   .on('drag', function(d){
    //     // move circle
    //     var dx = d3.event.dx;
    //     var dy = d3.event.dy;
    //     var x1New = parseFloat(d3.select(this).attr('x1'))+ dx;
    //     var y1New = parseFloat(d3.select(this).attr('y1'))+ dy;
    //     var x2New = parseFloat(d3.select(this).attr('x2'))+ dx;
    //     var y2New = parseFloat(d3.select(this).attr('y2'))+ dy;
    //     line.attr("x1",x1New)
    //         .attr("y1",y1New)
    //         .attr("x2",x2New)
    //         .attr("y2",y2New);
    //     }).on('dragend', function(){
    //   });

    // svg
    //   .append("line")
    //   .attr("x1",10)
    //   .attr("y1",10)
    //   .attr("x2",200)
    //   .attr("y2",200)
    //   .attr("stroke-width",10)
    //   .attr("stroke","black")
    //   .call(drag);

    function updateLine() {
      // console.log('box1', box1, 'box2', box2);
      onChange([0, 10]);
    }

    // Dragabel box
    const draw = this.drawFauxDOM;
    function dragged(obj) {
      console.log('event', event);
      // d.x = event.x;
      // d.y = event.y;
      // obj.attr("y", event.offsetY);

      // updateLine();
      onChange([0, 10]);
      draw();
      // d.x = event.offsetX;
      // d.y = event.offsetX;
      // return d;
    }

    var box1 = svg.append("rect")
      .datum({x: 0, y: 0})
      .attr("x", x(1))
      .attr("y", zero - scale*(manipulableLine[0] - manipulableLine[1]*8))
      .attr("width", 10)
      .attr("height", 10)
      .call(d3.drag()
        // .on("start", dragstarted)
        .on("drag", () => dragged(box1)));
        // .on("end", dragended));

    var box2 = svg.append("rect")
      .datum({x: 0, y: 0})
      .attr("x", x(8))
      .attr("y", zero - scale*(manipulableLine[0] - manipulableLine[1]*1))
      .attr("width", 10)
      .attr("height", 10)
      .call(d3.drag()
        // .on("start", dragstarted)
        .on("drag", () => dragged(box2)));
        // .on("end", dragended));

    // function dragstarted() {
    //   box1.classed("dragging", true);
    // }

    // function dragended() {
    //   box1.classed("dragging", false);
    // }

    // this.animateFauxDOM(1000000000000);
  },

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  },

  render() {
    return (
      <div className="renderedD3">
        {this.state.chart}
      </div>
    );
  }
});

export default DatamodelGraph;
