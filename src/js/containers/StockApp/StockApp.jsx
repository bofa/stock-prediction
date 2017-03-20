import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries, LineSeries } from 'react-vis';
import { Grid, Panel, Button, ButtonGroup } from 'react-bootstrap';
import BarChart from '../../components/BarChart';
import 'react-vis/dist/main.scss';

import { loadBorsdata } from '../../ducks/stocks';

class StockApp extends Component {
  static propTypes = {
    loadBorsdata: PropTypes.func.isRequired
  };

  render() {
    const { stocks } = this.props;

    const yieldArray = stocks
      .getIn(['hm', 5, 'Sparkline'], '')
      .split(',')
      .map((value, index, array) => ({
        year: 2017 + index - array.length,
        yield: Number(value)
      }));

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

    return (
      <div>
        <BarChart width={400} height={400} stockYield={yieldArray} />
        <Button bsStyle="primary" onClick={() => this.props.loadBorsdata('hm')}>Load</Button>
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
