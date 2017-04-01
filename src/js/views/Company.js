import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BarChart from '../components/BarChart';
import data from '../data';
import { mergeCompany } from '../ducks/stocks';
import { Map } from 'immutable';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Measure from 'react-measure';

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

  render () {
    const { stocks } = this.props;
    const shortName = this.props.params.company;
    const staticStockData = data.get(shortName);
    const dynamicStockData = stocks.get(shortName, Map());
    const compbinedData = staticStockData.mergeDeep(dynamicStockData);

    const earnings = staticStockData.get('earnings');
    const earningsLsStatic = staticStockData.get('earningsLs');
    const earningsLs = compbinedData.get('earningsLs');

    const revenue = staticStockData.get('revenue');
    const revenueLsStatic = staticStockData.get('revenueLs');
    const revenueLs = staticStockData.get('revenueLs');


    return (
      <div>
        <h1>
          <Link to='/stock-prediction'>Back</Link>
          {' ' + staticStockData.get('Name')}
        </h1>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Measure onMeasure={({width}) => this.setState({ width })}>
              <BarChart
                width={400}
                height={400}
                name={"Revenue"}
                bars={revenue.toJS()}
                line={revenueLsStatic.toJS()}
                manipulableLine={revenueLs.toJS()}
                onChange={this.setCompanyRevenue}
              />
            </Measure>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <BarChart
              width={400}
              height={400}
              name={"Earnings"}
              bars={earnings.toJS()}
              line={earningsLsStatic.toJS()}
              manipulableLine={earningsLs.toJS()}
              onChange={this.setCompanyEarnings}
            />
          </Col>
        </Row>
        <hr />
        <Link to='/stock-prediction'>Back To Home View</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stocks: state.stockReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mergeCompany: bindActionCreators(mergeCompany, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
