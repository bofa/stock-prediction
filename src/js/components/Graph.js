/* eslint react/prefer-es6-class: "off", max-len: "off" */
import React, { PropTypes } from 'react';
import * as d3 from 'd3';
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
    return true;
    const { data, width, height } = nextProps;
    // console.log('the data', data);

    const faux = this.connectFauxDOM('div.renderedD3', 'chart');
    // set the dimensions and margins of the diagram
    const margin = { top: 40, right: 90, bottom: 50, left: 90 };

    // declares a tree layout and assigns the size
    const treemap = d3.tree()
      .size([height - 100, width - 160]);

    //  assigns the data to a hierarchy using parent-child relationships
    const nodes = treemap(d3.hierarchy(data));

    // maps the node data to the tree layout
    // nodes = treemap(nodes);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select(faux).append('svg')
      .attr('width', width)
      .attr('height', height);
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // adds the links between the nodes
    g.selectAll('.link')
      .data(nodes.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d) =>
        `M${d.y},${d.x}
         C${(d.y + d.parent.y) / 2},${(d.x)}
         ${(d.y + d.parent.y) / 2},${d.parent.x}
         ${d.parent.y},${d.parent.x}`,
      )
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', '2px');


    // adds each node as a group
    const node = g.selectAll('.node')
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('class', d => `node ${(d.children ? ' node--internal' : ' node--leaf')}`)
      // .attr('transform', d =>
      //   `translate(${d.x},${d.y})`
      // );
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // adds the circle to the node
    node.append('circle')
      .attr('r', 3)
      .attr('fill', '#fff')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '3px');

    // adds the text to the node
    node.append('text')
      .attr('dy', '.35em')
      .attr('y', d => (d.children ? -20 : 20))
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(d => d.data.name)
      ;

    this.animateFauxDOM(800);
  },

  render() {
    return (
      <div className="renderedD3">
        {this.state.chart}
      </div>
    );
  },
});

export default DatamodelGraph;
