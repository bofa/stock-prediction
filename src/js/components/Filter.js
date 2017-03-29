import React, { Component, PropTypes } from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';

const sliderStyle = {
  textAlign: 'center'
};

export default class Filter extends Component {
  static propTypes = {
    positiveEarningsGrowth: PropTypes.boolean,
    positiveRevenuGrowth: PropTypes.boolean,
    minHistoryLength: PropTypes.integer,
    setPositiveEarningsGrowth: PropTypes.func,
    setPositiveRevenuGrowth: PropTypes.func,
    setMinHistoryLength: PropTypes.func
  };

  render() {
    const { positiveEarningsGrowth, positiveRevenuGrowth, minHistoryLength } = this.props;
    const { setPositiveEarningsGrowth, setPositiveRevenuGrowth, setMinHistoryLength } = this.props;

    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text="Positive Earnings Growth" />
          <Toggle
            toggled={positiveEarningsGrowth}
            onToggle={(e, value) => this.props.setPositiveEarningsGrowth(value)}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle text="Positive Revenu Growth" />
          <Toggle
            style={sliderStyle}
            toggled={positiveRevenuGrowth}
            onToggle={(e, active) => this.props.setPositiveRevenuGrowth(active)}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle text={minHistoryLength} />
          <Slider
            value={minHistoryLength}
            style={{width: 200}}
            min={1} max={10} step={1}
            onChange={(e, value) => setMinHistoryLength(value)}
          />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
