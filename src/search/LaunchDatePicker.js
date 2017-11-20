import React, { Component } from 'react';
import { DateRangePicker } from '../dependencies/react-date-dependencies'
import { defaultStartDate, defaultEndDate } from "../defaults/all"

class LaunchDatePicker extends Component {
  constructor() {
    super();
    this.state = {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      focusedInput: null
    }
  }

  updateDates = (startDate, endDate) => {
    this.setState({ startDate: startDate, endDate: endDate });
    this.props.updateParentDate({ startDate: startDate, endDate: endDate });
  }

  render() {
    return (
      <div className="Launch-date-picker">
        <DateRangePicker
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onDatesChange={({ startDate, endDate }) => this.updateDates(startDate, endDate) }
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => this.setState({ focusedInput })}
          showClearDates={true}

          //Necessary to allow users to pick dates earlier than today:
          //https://github.com/airbnb/react-dates/issues/239#issuecomment-302574295
          isOutsideRange={() => false } />
      </div>
    );
  }

}

export default LaunchDatePicker;