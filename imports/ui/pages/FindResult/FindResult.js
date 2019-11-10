import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { Chart } from 'react-google-charts';
import numeral from 'numeral';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from 'moment';
import Switch from 'react-switch';
import vi from 'date-fns/locale/vi'; // register Vietnamese locale

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import OneRoundResultMatch from '../../components/OneRoundResultMatch';
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './FindResult.scss';
import 'react-datepicker/dist/react-datepicker.css';
// the Vietnamese locale
registerLocale('vi', vi);

class FindResult extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNums: [],
      selectedDate: undefined,
      matchedOnly: true,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  isVlotDate(date) {
    const day = date.getDay();
    return day !== 1 && day !== 2 && day !== 4 && day !== 6;
  }

  render() {
    const { loggedIn, roundsReady, rounds } = this.props;
    const { selectedNums, selectedDate, matchedOnly } = this.state;

    const numMatrix = [
      [1, 11, 21, 31, 41],
      [2, 12, 22, 32, 42],
      [3, 13, 23, 33, 43],
      [4, 14, 24, 34, 44],
      [5, 15, 25, 35, 45],
      [6, 16, 26, 36],
      [7, 17, 27, 37],
      [8, 18, 28, 38],
      [9, 19, 29, 39],
      [10, 20, 30, 40],
    ];

    const renderNumMatrix = _.map(numMatrix, (row, index) => {
      return (
        <tr key={index}>
          {_.map(row, num => {
            return (
              <td key={num}>
                <span
                  className={
                    this.state[`num${num}`]
                      ? 'tool-select-num active'
                      : 'tool-select-num'
                  }
                  onClick={() => {
                    const newState = !this.state[`num${num}`];

                    if (newState && selectedNums.length < 6) {
                      this.setState({ [`num${num}`]: newState });
                      selectedNums.push(num);
                      this.setState({ selectedNums });
                    }
                    if (!newState) {
                      this.setState({ [`num${num}`]: newState });
                      const newSelectedNums = _.without(selectedNums, num);
                      this.setState({ selectedNums: newSelectedNums });
                    }
                  }}
                >
                  {num}
                </span>
              </td>
            );
          })}
        </tr>
      );
    });

    let resultRender = [1].map(() => {
      return (
        <div key="1" className="list-group">
          <div className="list-group-item text-center animated fadeIn">
            Không tìm thấy lượt trúng
          </div>
        </div>
      );
    });

    const matchedResult = _.map(
      _.filter(rounds, round => {
        return selectedDate
          ? moment(round.regISODate).isSame(moment(selectedDate), 'day')
          : true;
      }),
      round => {
        const num1Check = _.contains(selectedNums, round.result.num1);
        const num2Check = _.contains(selectedNums, round.result.num2);
        const num3Check = _.contains(selectedNums, round.result.num3);
        const num4Check = _.contains(selectedNums, round.result.num4);
        const num5Check = _.contains(selectedNums, round.result.num5);
        const num6Check = _.contains(selectedNums, round.result.num6);
        const generalCheck =
          _.size(
            _.compact([
              num1Check,
              num2Check,
              num3Check,
              num4Check,
              num5Check,
              num6Check,
            ])
          ) >= 3;

        return {
          ...round,
          result: {
            ...round.result,
            num1Matched: num1Check,
            num2Matched: num2Check,
            num3Matched: num3Check,
            num4Matched: num4Check,
            num5Matched: num5Check,
            num6Matched: num6Check,
            generalMatched: generalCheck,
          },
        };
      }
    );
    const showResult = matchedOnly
      ? _.filter(matchedResult, result => {
          return result.result.generalMatched;
        })
      : matchedResult;

    if (showResult.length > 0) {
      resultRender = _.map(showResult, round => {
        return <OneRoundResultMatch key={round.index} roundData={round} />;
      });
    }

    return (
      <div className="container analyse-all">
        <h1 className="animated fadeIn">Dò kết quả</h1>
        <h5 className="animated fadeIn mb-4">
          <i>
            * Chọn bộ số cần dò. Kết quả dựa trên tất cả lượt sổ trong 60 ngày
            gần nhất.
          </i>
        </h5>

        {!roundsReady && <PulseLoader />}
        {roundsReady && (
          <div className="row animated fadeIn mb-4">
            <div className="col-12 col-sm-4 tool-num-selector-wrap">
              <h3>Chọn ngày</h3>
              <form className="mb-4">
                <div className="form-group">
                  <DatePicker
                    locale="vi"
                    className="form-control"
                    todayButton="Hôm nay"
                    dateFormat="dd MMM yyyy"
                    selected={selectedDate}
                    minDate={new Date('2016-07-20')}
                    maxDate={new Date()}
                    filterDate={this.isVlotDate}
                    onChange={date => {
                      this.setState({ selectedDate: date });
                    }}
                    isClearable
                  />
                </div>
              </form>
              <h3>Chọn 6 số</h3>
              <div className="tool-num-selector mb-4">
                <table>
                  <tbody>{renderNumMatrix}</tbody>
                </table>
              </div>
            </div>
            <div className="col-12 col-sm-8 tool-num-selector-wrap">
              <h3>Kết quả</h3>
              <div>
                <label>
                  <Switch
                    onChange={() => {
                      this.setState({ matchedOnly: !this.state.matchedOnly });
                    }}
                    checked={this.state.matchedOnly}
                    className="react-switch mr-2"
                    uncheckedIcon={<svg />}
                    checkedIcon={<svg />}
                    offColor="#343a40"
                    onColor="#28a745"
                  />
                  <span>
                    {matchedOnly ? 'Chỉ hiện lượt trúng' : 'Hiện tất cả'}
                  </span>
                </label>
              </div>
              <div className="list-group result-list">{resultRender}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

FindResult.defaultProps = {
  rounds: null,
};

FindResult.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  roundsReady: PropTypes.bool.isRequired,
  rounds: Rounds ? PropTypes.array.isRequired : () => null,
};

export default withTracker(() => {
  const roundsSub = Meteor.subscribe('rounds60Days');
  const rounds = Rounds.find(
    {
      regISODate: {
        $gte: new Date(moment(new Date()).subtract(59, 'days')),
      },
    },
    {
      sort: { index: -1 },
    }
  ).fetch();
  const roundsReady = roundsSub.ready() && !!rounds;
  return {
    roundsReady,
    rounds,
    currentUser: Meteor.user(),
  };
})(FindResult);
