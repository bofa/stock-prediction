import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

export default class App extends Component {
  static propTypes = {
    headers: PropTypes.array.isRequired,
    table: PropTypes.array.isRequired,
    checkbox: PropTypes.bool,
    onRowSelection: PropTypes.func
  };

  render() {
    const { headers, table, checkbox, onRowSelection } = this.props;

    return (
      <Table
        multiSelectable
        onRowSelection={onRowSelection}
      >
        <TableHeader
          displaySelectAll={checkbox}
          adjustForCheckbox={checkbox}
        >
          <TableRow>
            {headers.map(header => <TableHeaderColumn>{header}</TableHeaderColumn>)}
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={false}
          displayRowCheckbox={checkbox}
        >
          {table.map((item) =>
            <TableRow>
              {item.map(index =>
                <TableRowColumn>
                  {index}
                </TableRowColumn>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }
}
