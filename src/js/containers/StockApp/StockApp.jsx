import { List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Grid, Panel, Button, ButtonGroup } from 'react-bootstrap';
import BarChart from '../../components/BarChart';
import Table from '../../components/Table';
import 'react-vis/dist/main.scss';

import { loadBorsdata } from '../../ducks/stocks';

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

    console.log('this.state', this.state);

    return (
      <div>
        <Table />
        <input value={stock} onChange={(event) => this.setState({ stock: event.target.value })} type="text" name="firstname" /><br />
        <Button bsStyle="primary" onClick={() => this.props.loadBorsdata(stock)}>Load</Button>
        <BarChart width={400} height={400} stockYield={yieldArray} />
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
