import React, { PureComponent } from 'react';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
// import pl from 'date-fns/locale/pl'
// const localeMap = {
//   pl: pl,
// };
export default class Time extends React.Component {




  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} >
        <DateTimePicker
          value={this.props.selected}
          onChange={this.props.date}
        />
      </MuiPickersUtilsProvider>
    );
  }
}