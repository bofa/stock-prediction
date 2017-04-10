import { List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'react-vis/dist/main.scss';
import Table from '../components/Table';
import Filter from '../components/Filter';
import companys from '../data';
import earningsEstimate from '../services/ls';
import { setPositiveEarningsGrowth, setPositiveRevenuGrowth, setMinHistoryLength } from '../ducks/filter';


// const buttonStyle = {
//   margin: 12,
// };

class StockApp extends Component {
  static propTypes = {
    loadBorsdata: PropTypes.func.isRequired,
    stocks: PropTypes.object.isRequired,
    positiveEarningsGrowth: PropTypes.boolean,
    positiveRevenuGrowth: PropTypes.boolean,
    minHistoryLength: PropTypes.integer,
    projectionTime: PropTypes.integer,
    setPositiveEarningsGrowth: PropTypes.func,
    setPositiveRevenuGrowth: PropTypes.func,
    setMinHistoryLength: PropTypes.func
  };

  render() {
    const { stocks, positiveEarningsGrowth, positiveRevenuGrowth, minHistoryLength, projectionTime } = this.props;
    const { setPositiveEarningsGrowth, setPositiveRevenuGrowth, setMinHistoryLength } = this.props;

    const companysMerge = companys.mergeDeep(stocks)
      .filter(company => company.getIn(['historyLength']) >= minHistoryLength)
      .filter(company => positiveEarningsGrowth ? company.getIn(['earningsLs', 1]) >= 0 : true)
      .filter(company => positiveRevenuGrowth ? company.getIn(['revenueLs', 1]) >= 0 : true)
      .map(company => company.set('estimate', earningsEstimate(company, projectionTime)))
      .filter(company => !isNaN(company.get('estimate')))
      .toList()
      .sortBy(company => -company.get('estimate'));
      // .filter((value, index) => index < 100);

    // console.log('companysMerge', companysMerge.toJS());
    // console.log('this.state', this.state);

    return (
      <div>
        <Filter
          positiveEarningsGrowth={positiveEarningsGrowth}
          positiveRevenuGrowth={positiveRevenuGrowth}
          minHistoryLength={minHistoryLength}
          setPositiveEarningsGrowth={setPositiveEarningsGrowth}
          setPositiveRevenuGrowth={setPositiveRevenuGrowth}
          setMinHistoryLength={setMinHistoryLength}
        />
        <Table companys={companysMerge} />
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
    projectionTime: 5
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setPositiveEarningsGrowth: bindActionCreators(setPositiveEarningsGrowth, dispatch),
    setPositiveRevenuGrowth: bindActionCreators(setPositiveRevenuGrowth, dispatch),
    setMinHistoryLength: bindActionCreators(setMinHistoryLength, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StockApp);
