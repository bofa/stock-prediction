import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import { rootRoute } from '../routes';
import { bindActionCreators } from 'redux';
import {
  setPositiveEarningsGrowth,
  setPositiveRevenuGrowth,
  setMinHistoryLength,
  setMinCorrelation,
  setSortOn,
  setIntrest,
} from '../ducks/filter';
import { connect } from 'react-redux';

const sliderStyle = {
  width: 200
};

class Filter extends Component {
  static propTypes = {
    positiveEarningsGrowth: PropTypes.boolean,
    positiveRevenuGrowth: PropTypes.boolean,
    minHistoryLength: PropTypes.integer,
    minCorrelation: PropTypes.number,
    intrest: PropTypes.number,
    setPositiveEarningsGrowth: PropTypes.func,
    setPositiveRevenuGrowth: PropTypes.func,
    setMinHistoryLength: PropTypes.func,
    setMinCorrelation: PropTypes.func,
    sortOn: PropTypes.string,
    setSortOn: PropTypes.func,
    setIntrest: PropTypes.func
  };

  state = {
    open: false,
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    const { positiveEarningsGrowth, positiveRevenuGrowth, minHistoryLength, minCorrelation, sortOn, intrest } = this.props;
    const { setPositiveEarningsGrowth, setPositiveRevenuGrowth, setMinHistoryLength, setMinCorrelation, setSortOn, setIntrest } = this.props;

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
            toggled={positiveRevenuGrowth}
            onToggle={(e, active) => setPositiveRevenuGrowth(active)}
          />

          <ToolbarTitle text={'Min History: ' + minHistoryLength} />
          <Slider
            value={minHistoryLength}
            style={sliderStyle}
            min={1} max={10} step={1}
            onChange={(e, value) => setMinHistoryLength(value)}
          />

          <ToolbarTitle text={'Min Correlation Coefficient: ' + minCorrelation} />
          <Slider
            value={minCorrelation}
            style={sliderStyle}
            min={0} max={1}
            onChange={(e, value) => setMinCorrelation(value)}
          />

          <ToolbarTitle text={'Intrest offset: ' + Math.round(1000*intrest) / 10 + '%'} />
          <Slider
            value={100*intrest}
            style={sliderStyle}
            min={-10} max={10}
            onChange={(e, value) => setIntrest(0.01*value)}
          />

          <ToolbarTitle text="Sort By" />
          <RadioButtonGroup
            valueSelected={sortOn}
            onChange={(event, value) => setSortOn(value)}
            name="shipSpeed"
            defaultSelected="dividend"
          >
            <RadioButton
              value="dividend"
              label="Dividend"
            />
            <RadioButton
              value="earnings"
              label="Earnings"
            />
          </RadioButtonGroup>

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

function mapStateToProps(state) {
  return {
    stocks: state.stockReducer,
    positiveEarningsGrowth: state.filterReducer.get('positiveEarningsGrowth'),
    positiveRevenuGrowth: state.filterReducer.get('positiveRevenuGrowth'),
    minHistoryLength: state.filterReducer.get('minHistoryLength'),
    minCorrelation: state.filterReducer.get('minCorrelation'),
    sortOn: state.filterReducer.get('sortOn'),
    intrest: state.filterReducer.get('intrest'),
    projectionTime: 5
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setPositiveEarningsGrowth: bindActionCreators(setPositiveEarningsGrowth, dispatch),
    setPositiveRevenuGrowth: bindActionCreators(setPositiveRevenuGrowth, dispatch),
    setMinHistoryLength: bindActionCreators(setMinHistoryLength, dispatch),
    setMinCorrelation: bindActionCreators(setMinCorrelation, dispatch),
    setSortOn: bindActionCreators(setSortOn, dispatch),
    setIntrest: bindActionCreators(setIntrest, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
