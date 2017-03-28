import { List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'react-vis/dist/main.scss';
import Table from '../components/Table';
import companys from '../data';
import earningsEstimate from '../services/ls';
import { loadBorsdata } from '../ducks/stocks';
import { setPositiveEarningsGrowth, setPositiveRevenuGrowth } from '../ducks/filter';

// import IconMenu from 'material-ui/IconMenu';
// import IconButton from 'material-ui/IconButton';
// import FontIcon from 'material-ui/FontIcon';
// import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
// import MenuItem from 'material-ui/MenuItem';
// import DropDownMenu from 'material-ui/DropDownMenu';
// import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';

// const buttonStyle = {
//   margin: 12,
// };

class StockApp extends Component {
  static propTypes = {
    loadBorsdata: PropTypes.func.isRequired,
    stocks: PropTypes.object.isRequired,
    positiveEarningsGrowth: PropTypes.boolean,
    positiveRevenuGrowth: PropTypes.boolean,
    setPositiveEarningsGrowth: PropTypes.func,
    setPositiveRevenuGrowth: PropTypes.func
  };

  render() {
    const { stocks, positiveEarningsGrowth, positiveRevenuGrowth } = this.props;

    const companysMerge = companys.mergeDeep(stocks)
      .map(company => company.set('estimate', earningsEstimate(company, 3)))
      .filter(company => !isNaN(company.get('estimate')))
      .filter(company => positiveEarningsGrowth ? company.getIn(['earningsLs', 1]) >= 0 : true)
      .filter(company => positiveRevenuGrowth ? company.getIn(['revenueLs', 1]) >= 0 : true)
      .toList()
      .sortBy(company => -company.get('estimate'));

    // console.log('companysMerge', companysMerge.toJS());
    // console.log('this.state', this.state);

    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <Toggle
              toggled={positiveEarningsGrowth}
              onToggle={(e, value) => this.props.setPositiveEarningsGrowth(value)}
              label="Positive Earnings Growth"
            />
            <Toggle
              toggled={positiveRevenuGrowth}
              onToggle={(e, active) => this.props.setPositiveRevenuGrowth(active)}
              label="Positive Revenu Growth"
            />
          </ToolbarGroup>
        </Toolbar>
        <Table companys={companysMerge} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stocks: state.stockReducer,
    positiveEarningsGrowth: state.filterReducer.get('positiveEarningsGrowth', true),
    positiveRevenuGrowth: state.filterReducer.get('positiveRevenuGrowth', true)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setPositiveEarningsGrowth: bindActionCreators(setPositiveEarningsGrowth, dispatch),
    setPositiveRevenuGrowth: bindActionCreators(setPositiveRevenuGrowth, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StockApp);
