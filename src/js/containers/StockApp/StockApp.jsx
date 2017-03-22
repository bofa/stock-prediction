import { List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Grid, Panel, Button, ButtonGroup } from 'react-bootstrap';
import BarChart from '../../components/BarChart';
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

    const yieldArray = stocks.getIn([stock, 5, 'Sparkline'], new List()).toJS();

    console.log('yieldArray', yieldArray);

    /*let chartsByPrice = this.props.tradePriceOverTime.map((stockData) => (
      <Panel collapsible
             header={stockData.symbol + '| Price over time | As of: ' + moment(stockData.asOfDate).format("MMM Do YYYY")}
             key={stockData.symbol}>
        <XYPlot
          animation={{duration: 500}}
          xType="time"
          width={500}
          height={300}>
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <LineSeries
            data={stockData.data}/>
        </XYPlot>
      </Panel>
    ));

    let chartsByVolumeAndTime = this.props.exchangeVolumeByMinutes.map((stockData) => (
      <Panel key={stockData.symbol} collapsible header={stockData.symbol + ' | Volume by every 10 mins'}>
        <XYPlot
          animation={{duration: 500}}
          xType="time"
          width={500}
          height={300}>
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries
            data={stockData.data}/>
        </XYPlot>
        <ButtonGroup>
          <Button value="10" onClick={this.setTimeDuration.bind(this)}>10</Button>
          <Button value="20" onClick={this.setTimeDuration.bind(this)}>20</Button>
          <Button value="30" onClick={this.setTimeDuration.bind(this)}>30</Button>
        </ButtonGroup>
      </Panel>
    ));

    let chartByVolume = (
      <Panel key="chartByVolume" collapsible header="By Volume">
        <XYPlot
          animation={{duration: 500}}
          xType="ordinal"
          width={500}
          height={300}>
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries
            data={this.props.tradeVolumePerAccount}/>
        </XYPlot>
      </Panel>
    );*/

    console.log('this.state', this.state);

    return (
      <div>
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
