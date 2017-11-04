/* eslint react/prefer-es6-class: "off", max-len: "off" */
import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import d3Drag from 'd3-drag';
import Faux from 'react-faux-dom';

// Can't use ES6 because Faux needs mixins too work.
const Histogram = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    bars: PropTypes.array.isRequired,
    line: PropTypes.array.isRequired,
    manipulableLine: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    projectionTime: PropTypes.number,
    data: PropTypes.array,
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

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    const { gurka, width, height } = nextProps;

    const data = gurka[0];

    const faux = this.connectFauxDOM('div.renderedD3', 'chart');
    // set the dimensions and margins of the diagram
    const margin = { top: 20, right: 10, bottom: 0, left: 0 };

    const svg = d3.select(faux).append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // var x = d3.scaleLinear().domain([0, bars.length]).range([0, width]);

    // var data = d3.range(1000).map(d3.randomBates(10));

    var formatCount = d3.format(",.0f");

    var x = d3.scaleLinear().domain([d3.min(data), d3.max(data)]).rangeRound([0, width]);

    console.log('x.domain()', x.domain());

    const histogram = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(20));

    var bins = histogram(gurka[0]);
    var bins2 = histogram(gurka[1]);

    console.log('bins', bins);

    var y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)])
      .range([height, 0]);

    var bar = g.selectAll(".bar")
      .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("fill", "#00ff00")
        .attr("opacity", 0.7)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    var bar2 = g.selectAll(".bar2")
      .data(bins2)
      .enter().append("g")
        .attr("class", "bar2")
        .attr("fill", "#00ffff")
        .attr("opacity", 0.7)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("height", function(d) { return height - y(d.length); });

    bar2.append("rect")
      .attr("x", 1)
      .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
      .attr("height", function(d) { return height - y(d.length); });

    bar.append("text")
      .attr("dy", ".75em")
      .attr("y", 6)
      .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#000000")
      .text(function(d) { return formatCount(d.length); });

    // bar.append("text")
    //   // .attr("dy", ".75em")
    //   .attr("y", 0)
    //   .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
    //   .attr("text-anchor", "middle")
    //   .attr("fill", "#000000")
    //   .text(d => d);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  },

  render() {
    return (
      <div className="renderedD3">
        {this.state.chart}
      </div>
    );
  }
});

export default Histogram;
