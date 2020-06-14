import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import cx from "classnames";
import createDateObjects from "./createDateObjects";

export default class Calendar extends Component {
  static propTypes = {
    /** Week offset*/
    weekOffset: PropTypes.number.isRequired,
    /** The current date as a moment objecct */
    date: PropTypes.object.isRequired,
    /** Function to render a day cell */
    renderDay: PropTypes.func,
    /** Function to render the header */
    renderHeader: PropTypes.func,
    /** Called on next month click */
    onNextMonth: PropTypes.func,
    /** Called on prev month click */
    onPrevMonth: PropTypes.func,
    /** Called when some of the navigation controls are clicked */
    onChangeMonth: PropTypes.func,
    /** Called when a date is clicked */
    onPickDate: PropTypes.func,
    /** classname for div wrapping the whole calendar */
    containerClassName: PropTypes.string,
    /** classname for the div wrapping the grid */
    contentClassName: PropTypes.string,
  };

  static defaultProps = {
    weekOffset: 0,
    renderDay: ({
      date,
      day,
      selectedDay,
      setSelectedDay,
      classNames,
      onPickDate,
    }) => (
      <div
        key={day.format()}
        className={cx(
          "Calendar-grid-item",
          day.isSame(date, "week") && "Calendar-grid-item--week",
          day.isSame(moment(), "day") && "Calendar-grid-item--current",
          day.isSame(selectedDay, "day") && "Calendar-grid-item--selected",
          day.isBefore(moment(), "day") && "prevMonth",
          classNames,
        )}
        onClick={() => {
          if (!day.isBefore(moment(), "day")) {
            setSelectedDay(day);
            onPickDate(moment(day));
          }
        }}
      >
        {day.format("D")}
      </div>
    ),
    renderHeader: ({ date, onPrevMonth, onNextMonth }) => (
      <div className="Calendar-header">
        <button onClick={onPrevMonth}>«</button>
        <div className="Calendar-header-currentDate">
          {date.format("MMMM YYYY")}
        </div>
        <button onClick={onNextMonth}>»</button>
      </div>
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      selectedDay: moment(),
    };
  }

  handleNextMonth = () => {
    if (this.props.onNextMonth) {
      return this.props.onNextMonth();
    }

    const newDate = this.state.date.clone().add(1, "months");

    this.setState({ date: newDate });

    this.props.onChangeMonth(newDate);
  };

  handlePrevMonth = () => {
    if (this.props.onPrevMonth) {
      return this.props.onPrevMonth();
    }

    const newDate = this.state.date.clone().subtract(1, "months");

    this.setState({ date: newDate });

    this.props.onChangeMonth(newDate);
  };

  setSelectedDay = (selectedDay) => {
    this.setState({ selectedDay });
  };

  render() {
    const {
      weekOffset,
      renderDay,
      renderHeader,
      onPickDate,
      contentClassName,
      containerClassName,
    } = this.props;

    const { date, selectedDay } = this.state;
    const { setSelectedDay } = this;

    return (
      <div className={cx("Calendar", containerClassName)}>
        {renderHeader({
          date,
          onPrevMonth: this.handlePrevMonth,
          onNextMonth: this.handleNextMonth,
        })}
        <div className={cx("Calendar-grid", contentClassName)}>
          {createDateObjects(date, weekOffset).map((day, i) =>
            renderDay({
              ...day,
              selectedDay,
              onPickDate,
              setSelectedDay,
              date,
            }),
          )}
        </div>
      </div>
    );
  }
}
