import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BarChart from '../components/BarChart';
import data from '../data';
import { mergeCompany } from '../ducks/stocks';
import { Map } from 'immutable';
// import { Grid, Row, Col } from 'react-flexbox-grid';
// import Measure from 'react-measure';
import IconButton from 'material-ui/IconButton';
import earningsEstimate, { getProjection } from '../services/ls';

const rootPath = '/stock-prediction';

// const yieldArray = stocks.getIn([stock, 5, 'Sparkline'], new List());

class View extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    stocks: PropTypes.object.isRequired,
    mergeCompany: PropTypes.func.isRequired
  };

  state = {
    width: 400,
    height: 400
  }

  setCompanyEarnings = (manipulableLine) => {
    const shortName = this.props.params.company;
    this.props.mergeCompany(shortName, {
      earningsLs: manipulableLine
    });
  }

  setCompanyRevenue = (manipulableLine) => {
    const shortName = this.props.params.company;
    this.props.mergeCompany(shortName, {
      revenueLs: manipulableLine
    });
  }

  removeCompany = () => {
    // console.log('running remove');
    const shortName = this.props.params.company;
    this.props.mergeCompany(shortName, {
      hide: true
    });
    browserHistory.push(rootPath);
  }

  render () {
    const { stocks, projectionTime } = this.props;
    const shortName = this.props.params.company;
    const staticStockData = data.get(shortName);
    const dynamicStockData = stocks.get(shortName, Map());
    const combinedData = staticStockData.mergeDeep(dynamicStockData);

    const dividend = staticStockData.get('dividend');

    const earnings = staticStockData.get('earnings');
    const earningsLsStatic = staticStockData.get('earningsLs');
    const earningsLs = combinedData.get('earningsLs');

    const revenue = staticStockData.get('revenue');
    const revenueLsStatic = staticStockData.get('revenueLs');
    const revenueLs = staticStockData.get('revenueLs');

    const bars = revenue.mergeWith(
      (earning, revenue) => ({
        year: revenue.get('year'),
        earnings: revenue.get('yield'),
        revenue: earning.get('yield')
      }), earnings)
      .mergeWith((merged, dividend) => ({
        ...merged,
        dividend: dividend.get('yield')
      }), dividend)
      .toJS();

    const barsProjection = getProjection(combinedData, projectionTime);

    const combinedBars = bars.concat(barsProjection);

    console.log('combinedBars', combinedBars, 'barsProjection', barsProjection);

    return (
      <div>
        <h1>
          <IconButton
            iconClassName="material-icons"
            tooltip="Back"
            onClick={() => browserHistory.push(rootPath)}
            onTouchTap={() => browserHistory.push(rootPath)}
          >
            arrow_back
          </IconButton>
          <IconButton
            iconClassName="material-icons"
            tooltip="Remove"
            onClick={this.removeCompany}
            onTouchTap={this.removeCompany}
          >
            delete
          </IconButton>
          {' ' + staticStockData.get('Name') + ', '}
          {Math.round(1000 * earningsEstimate(combinedData, projectionTime)) / 10}%
        </h1>
        <BarChart
          width={600}
          height={400}
          name="Revenue"
          bars={combinedBars}
          line={earningsLsStatic.toJS()}
          manipulableLine={earningsLs.toJS()}
          onChange={this.setCompanyEarnings}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stocks: state.stockReducer,
    projectionTime: 5
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mergeCompany: bindActionCreators(mergeCompany, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
