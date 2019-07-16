import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BarChart from '../components/BarChart';
import importData from '../data';
import { mergeCompany } from '../ducks/stocks';
import { Map } from 'immutable';
// import { Grid, Row, Col } from 'react-flexbox-grid';
// import Measure from 'react-measure';
import IconButton from 'material-ui/IconButton';
import { dividendEstimate, getProjection, yearsToPayOff } from '../services/ls';
import { rootRoute } from '../routes';
import bdIcon from '../../images/bd.png';
import { setModel, parseMargin } from '../services/company';

// const yieldArray = stocks.getIn([stock, 5, 'Sparkline'], new List());

class View extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    stocks: PropTypes.object.isRequired,
    mergeCompany: PropTypes.func.isRequired,
    intrest: PropTypes.number,
    minHistoryLength: PropTypes.number
  };

  state = {
    width: 400,
    height: 400
  }

  constructor() {
    super();
    importData().then(data => this.setState({ data }));
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
    const shortName = this.props.params.company;
    this.props.mergeCompany(shortName, {
      hide: true
    });
    browserHistory.push(rootRoute);
  }

  render () {
    const { stocks, projectionTime, intrest, minHistoryLength } = this.props;
    const { data } = this.state;

    if(!data) return false;

    const shortName = this.props.params.company;
    const staticStockData = data.get(shortName)
      .update(company => setModel(company, minHistoryLength));
    const dynamicStockData = stocks.get(shortName, Map());
    const combinedData = staticStockData
      .mergeDeep(dynamicStockData);

    const dividend = staticStockData.get('dividend');

    const earnings = staticStockData.get('earnings');
    const earningsLsStatic = staticStockData.get('earningsLs');
    const earningsLs = combinedData.get('earningsLs');

    const revenue = staticStockData.get('revenue');
    const revenueLsStatic = staticStockData.get('revenueLs');
    const revenueLs = staticStockData.get('revenueLs');

    const freeCashFlow = staticStockData.get('freeCashFlow');

    const countryUrlName = staticStockData.get('CountryUrlName');

    // console.log('staticStockData', staticStockData.toJS());
    // console.log('dynamicStockData', dynamicStockData.toJS());

    // console.log('revenue', revenue.toJS());
    // console.log('earnings', earnings.toJS());

    const bars = revenue.mergeWith(
      (revenue, earnings, index) => ({
        year: index, // revenue.get('year'),
        earnings,
        revenue
      }), earnings)
      .mergeWith((merged, dividend) => ({
        ...merged,
        dividend: dividend
      }), dividend)
      .mergeWith((merged, freeCashFlow) => ({
        ...merged,
        freeCashFlow: freeCashFlow
      }), freeCashFlow)
      .toJS();

    const barsProjection = getProjection(combinedData, projectionTime);

    return (
      <div>
        <h1>
          <IconButton
            iconClassName="material-icons"
            tooltip="Back"
            onClick={() => browserHistory.push(rootRoute)}
            onTouchTap={() => browserHistory.push(rootRoute)}
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
          {Math.round(1000 * dividendEstimate(combinedData, projectionTime, intrest)/combinedData.get('price')/combinedData.getIn(['numberOfStocks', -1])) / 10}% / y,
          {' ' + Math.round(10 * yearsToPayOff(combinedData)) / 10 + 'y'}
          {' '}
          <a href={`https://borsdata.se/${countryUrlName}/nyckeltal`} target="_blank">
            <img border="0" alt="W3Schools" src={bdIcon} />
          </a>
        </h1>
        <BarChart
          width={800}
          height={400}
          bars={bars}
          barsProjected={barsProjection}
          line={earningsLsStatic.toJS()}
          manipulableLine={earningsLs.toJS()}
          onChange={this.setCompanyEarnings}
          minHistoryLength={minHistoryLength}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stocks: state.stockReducer,
    intrest: state.filterReducer.get('intrest'),
    projectionTime: state.filterReducer.get('projectionTime'),
    minHistoryLength: state.filterReducer.get('minHistoryLength'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mergeCompany: bindActionCreators(mergeCompany, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
