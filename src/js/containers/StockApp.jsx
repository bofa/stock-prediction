import { List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Table from '../components/Table';
import 'react-vis/dist/main.scss';
import companys from '../data';
import earningsEstimate from '../services/ls';

import { loadBorsdata } from '../ducks/stocks';

class StockApp extends Component {
  static propTypes = {
    loadBorsdata: PropTypes.func.isRequired,
    stocks: PropTypes.object.isRequired
  };

  state = {
    stock: 'hm'
  }

  render() {
    const { stocks } = this.props;
    const { stock } = this.state;

    // console.log('yieldArray', stocks.toJS());
    const yieldArray = stocks.getIn([stock, 5, 'Sparkline'], new List());

    console.log('companys', companys.toJS(), 'stocks', stocks.toJS());

    const companysMerge = companys.mergeDeep(stocks)
      .map(company => company.set('estimate', earningsEstimate(company, 3)))
      .toList()
      .sortBy(company => -company.get('estimate'));

    console.log('companysMerge', companysMerge.toJS());

    return (
      <div>
        <Table companys={companysMerge} />
      </div>
    );

    /*return (
      <Grid className="charts">
        <BarChart width={400} height={400} stockYield={yieldArray} />
        <Button bsStyle="primary" onClick={() => this.props.loadBorsdata('hm')}>Load</Button>
      </Grid>
    );*/
  }
}

function mapStateToProps(state) {
  return {
    stocks: state.stockReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadBorsdata: bindActionCreators(loadBorsdata, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StockApp);
