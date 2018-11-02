import React, { PureComponent } from 'react';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';

export default class Time extends React.Component {
  state = {
    selectedDate: new Date(),
  }



  render() {
    const { selectedDate } = this.state;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
        // PopoverProps={this.props.alert}
          value={this.props.selected}
          onChange={this.props.date}
        />
      </MuiPickersUtilsProvider>
    );
  }
}