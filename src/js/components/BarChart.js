/* eslint react/prefer-es6-class: "off", max-len: "off" */
import React, { PropTypes } from 'react';
import * as d3 from 'd3';
// import d3Drag from 'd3-drag';
import Faux from 'react-faux-dom';

// Can't use ES6 because Faux needs mixins too work.
const DatamodelGraph = React.createClass({
  propTypes: {
    data: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    init: PropTypes.func.isRequired
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
    const { data, width, height } = nextProps;

    // if (!data) {
    //   return;
    // }
    // console.log('the data', data);

    // console.log('data', data);

    const faux = this.connectFauxDOM('div.renderedD3', 'chart');
    // set the dimensions and margins of the diagram
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    const svg = d3.select(faux).append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // const data = stockYield;

    var barWidth = 15;
    // var width = (barWidth + 10) * data.length;
    // var height = 200;

    var x = d3.scaleLinear().domain([0, data.length]).range([0, width]);
    var y = d3.scaleLinear().domain([d3.min(data, function(datum) { return datum.yield; }), d3.max(data, function(datum) { return datum.yield; })])
      // rangeRound([-height/2, height/2]);

    const max = Math.max(0, ...data.map(p => p.yield));
    const min = Math.min(0, ...data.map(p => p.yield));

    const scale = height / (max - min);
    const zero = height * max / (max - min);

    console.log('max', max, 'min', min, 'zero', zero, 'scale', scale);

    svg.selectAll("rect").
      data(data).
      enter().
      append("svg:rect").
      attr("x", function(datum, index) { return x(index); }).
      attr("y", function(datum) { return datum.yield > 0 ? zero - scale*datum.yield : zero; }).
      attr("height", function(datum) { return scale*Math.abs(datum.yield); }).
      // attr("y", function(datum) { return 0; }).
      // attr("height", function(datum) { return height/2; }).
      attr("width", barWidth).
      attr("fill", datum => datum.yield > 0 ? "#2d578b" : "#ff0000");

    // Dragabel box
    var box = svg.append("rect")
      .datum({x: 0, y: 0})
      // .attr("x", 10)
      // .attr("y", 10)
      .attr("width", 50)
      .attr("height", 100)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    function dragstarted() {
      box.classed("dragging", true);
    }

    const draw = this.drawFauxDOM;
    function dragged(d) {
      // console.log('event', d);
      // d.x = event.x;
      // d.y = event.y;
      box.attr("x", event.x)
        .attr("y", event.y);
      // this.drawFauxDOM();
      draw();
      return d;
    }

    function dragended() {
      box.classed("dragging", false);
    }

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
