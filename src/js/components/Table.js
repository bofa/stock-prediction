import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

export default class App extends Component {
  static propTypes = {
    headers: PropTypes.array.isRequired,
    table: PropTypes.array.isRequired
  };

  render() {
    const { headers, table } = this.props;

    return (
      <Table>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            {headers.map(header => <TableHeaderColumn>{header}</TableHeaderColumn>)}
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
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
