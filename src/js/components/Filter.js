import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { rootRoute } from '../routes';

const sliderStyle = {
  textAlign: 'center'
};

export default class Filter extends Component {
  static propTypes = {
    positiveEarningsGrowth: PropTypes.boolean,
    positiveRevenuGrowth: PropTypes.boolean,
    minHistoryLength: PropTypes.integer,
    minCorrelation: PropTypes.number,
    setPositiveEarningsGrowth: PropTypes.func,
    setPositiveRevenuGrowth: PropTypes.func,
    setMinHistoryLength: PropTypes.func,
    setMinCorrelation: PropTypes.func
  };

  state = {
    open: false,
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    const { positiveEarningsGrowth, positiveRevenuGrowth, minHistoryLength, minCorrelation } = this.props;
    const { setPositiveEarningsGrowth, setPositiveRevenuGrowth, setMinHistoryLength, setMinCorrelation } = this.props;

    return (
      <div>
        <Drawer
          docked={false}
          open={this.state.open}
          width={350}
        >
          <MenuItem
            onClick={() => this.setState({open: false})}
            style={{float: 'right'}}
          >
            Close
          </MenuItem>

          <ToolbarTitle text="Earnings Growth" />
          <Toggle
            toggled={positiveEarningsGrowth}
            onToggle={(e, value) => setPositiveEarningsGrowth(value)}
          />

          <ToolbarTitle text="Revenue Growth" />
          <Toggle
            style={sliderStyle}
            toggled={positiveRevenuGrowth}
            onToggle={(e, active) => setPositiveRevenuGrowth(active)}
          />

          <p>Min History Length</p>
          <ToolbarTitle text={minHistoryLength} />
          <Slider
            value={minHistoryLength}
            style={{width: 200}}
            min={1} max={10} step={1}
            onChange={(e, value) => setMinHistoryLength(value)}
          />

          <p>Correlation Coefficient Limit</p>
          <ToolbarTitle text={minCorrelation} />
          <Slider
            value={minCorrelation}
            style={{width: 200}}
            min={0} max={1}
            onChange={(e, value) => setMinCorrelation(value)}
          />

          <MenuItem
            onClick={() => browserHistory.push(rootRoute + 'return')}
          >
            Go To Calc IIR
          </MenuItem>
        </Drawer>
        <Toolbar>
          <ToolbarGroup>
            <RaisedButton
              label="Filter Settings"
              onClick={this.handleToggle}
            />
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}
