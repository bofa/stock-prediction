import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BarChart from '../components/BarChart';
import data from '../data';
import { mergeCompany } from '../ducks/stocks';

// const yieldArray = stocks.getIn([stock, 5, 'Sparkline'], new List());

class View extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    stocks: PropTypes.object.isRequired,
    mergeCompany: PropTypes.func.isRequired
  };

  setCompany = (manipulableLine) => {
    const shortName = this.props.params.company;
    this.props.mergeCompany(shortName, {
      lsParams: manipulableLine
    });
  }

  render () {
    const { stocks } = this.props;
    const shortName = this.props.params.company;
    const companyData = data.find(company => company.get('ShortName') === shortName);
    const earnings = companyData.getIn(['history', 5, 'Sparkline']);
    const lsParams = companyData.get('lsParams');

    // console.log('companyData', companyData);
    // console.log('earnings', earnings);

    // console.log('manipulableLine', stocks.get('lsParams'));
    // console.log('companyData.lsParams', companyData.lsParams);

    return (
      <div>
        <h1>
          <Link to='/stock-prediction'>Back </Link>
          {companyData.Name}
        </h1>
        <BarChart
          width={400}
          height={400}
          bars={earnings.toJS()}
          line={lsParams.toJS()}
          manipulableLine={lsParams.toJS()}
          onChange={this.setCompany}
        />
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
