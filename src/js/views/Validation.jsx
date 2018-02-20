import { List, Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import 'react-vis/dist/main.scss';
import { rootRoute } from '../routes';
import bdIcon from '../../images/bd.png';
import Table from '../components/Table';
import Filter from '../components/Filter';
import companys from '../data';
import { intrest as investmentIntrestGroups, saftyMargin } from '../data/manualData';
import { leastSquarceEstimate } from '../services/ls';
import Histogram from '../components/Histogram';

class Validation extends Component {
  static propTypes = {
    stocks: PropTypes.object.isRequired,
    positiveEarningsGrowth: PropTypes.boolean,
    positiveRevenuGrowth: PropTypes.boolean,
    positiveFreeCashFlowGrowth: PropTypes.boolean,
    minHistoryLength: PropTypes.integer,
    minCorrelation: PropTypes.number,
    projectionTime: PropTypes.integer,
    sortOn: PropTypes.string,
    intrest: PropTypes.number,
    leverageType: PropTypes.string,
  };

  state = {
  }

  render() {
    const {
      stocks,
      positiveEarningsGrowth,
      positiveRevenuGrowth,
      positiveFreeCashFlowGrowth,
      minHistoryLength,
      projectionTime,
      minCorrelation,
      sortOn,
      intrest,
      leverageType
    } = this.props;

    const revenueData = companys
      .filter(comp => comp.get('historyLength') > 8)
      .map(comp => comp
        .get('revenue')
        .get(-3));

    console.log('revenueData', revenueData.toJS());

    const estimationData = companys
      .filter(comp => comp.get('historyLength') > 8)
      .map(comp => comp
        .get('earnings')
        .skipLast(2));

    const validationData = companys
      .filter(comp => comp.get('historyLength') > 8)
      .map(comp => comp
        .get('earnings')
        .get(-2));

    const modelLinear = estimationData
      .map(item => item.toJS())
      .map(leastSquarceEstimate)
      .map(model => model[0] + 1*model[1]);

    const modelAverage = estimationData
      .map(values => values.reduce((sum, item, n) => sum + item, 0) / values.size);

    const modelLast = estimationData
      .map(values => values.last());

    const error = (v, m) => v-m;

    // const errorLinear = validationData.mergeWith(error, modelLinear).reduce((s, e) => s + e);
    // const errorAverage = validationData.mergeWith(error, modelAverage).reduce((s, e) => s + e);
    // const errorLast = validationData.mergeWith(error, modelLast).reduce((s, e) => s + e);

    const errorLinear = validationData.mergeWith(error, modelLinear).mergeWith((e, n) => e/n, revenueData);
    const errorAverage = validationData.mergeWith(error, modelAverage).mergeWith((e, n) => e/n, revenueData);
    const errorLast = validationData.mergeWith(error, modelLast).mergeWith((e, n) => e/n, revenueData);

    const reject = [40, -40];
    const plotLinear = errorLinear.toList().sort().slice(...reject).toJS();
    const plotAverage = errorAverage.toList().sort().slice(...reject).toJS();
    const plotLast = errorLast.toList().sort().slice(...reject).toJS();

    const data = [plotLinear, plotLast];
    // console.log('errorLinear', errorLinear/errorLast);
    // console.log('errorAverage', errorAverage/errorLast);
    // console.log('errorLast', errorLast/errorLast);

    // console.log('errorLinear', errorLinear.toJS());
    // console.log('errorAverage', errorAverage.toJS());
    // console.log('errorLast', errorLast.toJS());

    return (
      <div>
        Hej
        <Histogram gurka={data} width={512} height={512}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stocks: state.stockReducer,
    positiveEarningsGrowth: state.filterReducer.get('positiveEarningsGrowth'),
    positiveRevenuGrowth: state.filterReducer.get('positiveRevenuGrowth'),
    positiveFreeCashFlowGrowth:  state.filterReducer.get('positiveFreeCashFlowGrowth'),
    minHistoryLength: state.filterReducer.get('minHistoryLength'),
    minCorrelation: state.filterReducer.get('minCorrelation'),
    sortOn: state.filterReducer.get('sortOn'),
    intrest: state.filterReducer.get('intrest'),
    projectionTime: state.filterReducer.get('projectionTime'),
    leverageType: state.filterReducer.get('leverage'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Validation);
