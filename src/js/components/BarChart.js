/* eslint react/prefer-es6-class: "off", max-len: "off" */
import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import d3Drag from 'd3-drag';
import Faux from 'react-faux-dom';

// Can't use ES6 because Faux needs mixins too work.
const DatamodelGraph = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
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

  // componentWillMount() {
  //   // this.props.init();
  // },

  // componentWillReceiveProps(nextProps) {

  // },

  componentDidMount() {
    const { name, onChange, bars, line, manipulableLine, width, height } = this.props;

    const faux = this.connectFauxDOM('div.renderedD3', 'chart');
    // set the dimensions and margins of the diagram
    const margin = { top: 20, right: 10, bottom: 0, left: 0 };

    const svg = d3.select(faux).append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add title

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 + (margin.top))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(name);

    // Init transformations

    var barWidth = 15;

    var x = d3.scaleLinear().domain([0, bars.length]).range([0, width]);
    // var y = d3.scaleLinear().domain([d3.min(bars, function(datum) { return datum.yield; }), d3.max(bars, function(datum) { return datum.yield; })]);

    const timeLsEstimate1 = 0;
    const timeLsEstimate2 = 9;

    const originalValueLsEstimate1 = line[0] - line[1]*9;
    const originalValueLsEstimate2 = line[0] - line[1]*0;

    const valueLsEstimate1 = manipulableLine[0] - manipulableLine[1]*9;
    const valueLsEstimate2 = manipulableLine[0] - manipulableLine[1]*0;

    const max = Math.max(0, valueLsEstimate1, valueLsEstimate2, ...bars.map(p => p.yield));
    const min = Math.min(0, valueLsEstimate1, valueLsEstimate2, ...bars.map(p => p.yield));

    const extended = 1.05;
    const scale = height / (max - min) / extended;
    const zero = height * max / (max - min) / extended;

    const y = v => zero - scale*v;
    const yInv = y => (zero - y)/scale;

    console.log('line', line, 'manipulableLine', manipulableLine);

    svg.selectAll("rect").
      data(bars).
      enter().
      append("svg:rect").
      attr("x", function(datum, index) { return x(index); }).
      attr("y", function(datum) { return datum.yield > 0 ? y(datum.yield) : y(0); }).
      attr("height", function(datum) { return scale*Math.abs(datum.yield); }).
      // attr("y", function(datum) { return 0; }).
      // attr("height", function(datum) { return height/2; }).
      attr("width", barWidth).
      attr("fill", datum => datum.yield > 0 ? "#2d578b" : "#ff0000");

    // Draw line
    //Draw the line
    svg.append("line")
      .attr("x1", x(timeLsEstimate1) )
      .attr("y1", y(originalValueLsEstimate1))
      .attr("x2", x(timeLsEstimate2))
      .attr("y2", y(originalValueLsEstimate2))
      .attr("stroke-width", 2)
      .attr("stroke", "black");

    const lsLine2 = svg.append("line")
      .attr("x1", x(0) )
      .attr("y1", y(manipulableLine[0] - manipulableLine[1]*9))
      .attr("x2", x(bars.length-1))
      .attr("y2", y(manipulableLine[0]))
      .attr("stroke-width", 2)
      .attr("stroke", "black");

    // Dragabel box
    const draw = this.drawFauxDOM;
    function dragged(obj) {
      obj.attr("y", event.offsetY);

      lsLine2.attr('y1', box1.attr('y'))
             .attr('y2', box2.attr('y'));

      onChange([
        yInv(box2.attr('y')),
        (yInv(box2.attr('y')) - yInv(box1.attr('y')))/9
      ]);
      draw();
    }

    var box1 = svg.append("rect")
      .datum({x: 0, y: 0})
      .attr("x", x(timeLsEstimate1))
      .attr("y", y(valueLsEstimate1))
      .attr("width", 10)
      .attr("height", 10)
      .call(d3.drag()
        .on("drag", () => dragged(box1)));

    var box2 = svg.append("rect")
      .datum({x: 0, y: 0})
      .attr("x", x(timeLsEstimate2))
      .attr("y", y(valueLsEstimate2))
      .attr("width", 10)
      .attr("height", 10)
      .call(d3.drag()
        .on("drag", () => dragged(box2)));

    // this.animateFauxDOM(1000000000000);
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
