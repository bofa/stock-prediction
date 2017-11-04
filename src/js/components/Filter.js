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
  setPositiveFreeCashFlowGrowth,
  setMinHistoryLength,
  setMinCorrelation,
  setSortOn,
  setIntrest,
  setProjectionTime,
  setLeverage
} from '../ducks/filter';
import { connect } from 'react-redux';

const sliderStyle = {
  width: 200
};

class Filter extends Component {
  static propTypes = {
    positiveEarningsGrowth: PropTypes.boolean,
    positiveRevenuGrowth: PropTypes.boolean,
    positiveFreeCashFlowGrowth: PropTypes.boolean,
    minHistoryLength: PropTypes.integer,
    minCorrelation: PropTypes.number,
    intrest: PropTypes.number,
    sortOn: PropTypes.string,
    leverage: PropTypes.string,
    projectionTime: PropTypes.number,
    setPositiveEarningsGrowth: PropTypes.func,
    setPositiveRevenuGrowth: PropTypes.func,
    setPositiveFreeCashFlowGrowth: PropTypes.func,
    setMinHistoryLength: PropTypes.func,
    setMinCorrelation: PropTypes.func,
    setProjectionTime: PropTypes.func,
    setSortOn: PropTypes.func,
    setIntrest: PropTypes.func,
    setLeverage: PropTypes.func,
  };

  state = {
    open: false,
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    const { positiveEarningsGrowth,
      positiveRevenuGrowth,
      minHistoryLength,
      minCorrelation,
      sortOn,
      intrest,
      positiveFreeCashFlowGrowth,
      projectionTime,
      leverage
    } = this.props;
    const {
      setProjectionTime,
      setPositiveEarningsGrowth,
      setPositiveRevenuGrowth,
      setMinHistoryLength,
      setMinCorrelation,
      setSortOn,
      setIntrest,
      setPositiveFreeCashFlowGrowth,
      setLeverage
    } = this.props;

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

          <ToolbarTitle text="Cash Flow Growth" />
          <Toggle
            toggled={positiveFreeCashFlowGrowth}
            onToggle={(e, active) => setPositiveFreeCashFlowGrowth(active)}
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

          <ToolbarTitle text={'Projection Time: ' + projectionTime} />
          <Slider
            value={projectionTime}
            style={sliderStyle}
            min={1} max={20} step={1}
            onChange={(e, value) => setProjectionTime(value)}
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

          <ToolbarTitle text="Leverage" />
          <RadioButtonGroup
            valueSelected={leverage}
            onChange={(event, value) => setLeverage(value)}
            name="leverage"
            defaultSelected="dividend"
          >
            <RadioButton
              value="none"
              label="None"
            />
            <RadioButton
              value="avanza"
              label="Avanza"
            />
            <RadioButton
              value="nordnet"
              label="Nordnet"
            />
            <RadioButton
              value="best"
              label="Best"
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
    positiveFreeCashFlowGrowth: state.filterReducer.get('positiveFreeCashFlowGrowth'),
    minHistoryLength: state.filterReducer.get('minHistoryLength'),
    minCorrelation: state.filterReducer.get('minCorrelation'),
    sortOn: state.filterReducer.get('sortOn'),
    intrest: state.filterReducer.get('intrest'),
    projectionTime: state.filterReducer.get('projectionTime'),
    leverage: state.filterReducer.get('leverage'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setPositiveEarningsGrowth: bindActionCreators(setPositiveEarningsGrowth, dispatch),
    setPositiveRevenuGrowth: bindActionCreators(setPositiveRevenuGrowth, dispatch),
    setPositiveFreeCashFlowGrowth: bindActionCreators(setPositiveFreeCashFlowGrowth, dispatch),
    setMinHistoryLength: bindActionCreators(setMinHistoryLength, dispatch),
    setMinCorrelation: bindActionCreators(setMinCorrelation, dispatch),
    setSortOn: bindActionCreators(setSortOn, dispatch),
    setIntrest: bindActionCreators(setIntrest, dispatch),
    setProjectionTime: bindActionCreators(setProjectionTime, dispatch),
    setLeverage: bindActionCreators(setLeverage, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
