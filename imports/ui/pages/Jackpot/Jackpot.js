import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Cleave from 'cleave.js/react';
import { withTracker } from 'meteor/react-meteor-data';
import { Chart } from 'react-google-charts';
import numeral from 'numeral';

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './Jackpot.scss';

class Jackpot extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    const { loggedIn, roundsReady, rounds } = this.props;

    // Jackpot Value Chart
    const roundsJackpotHeader = [['x', 'Gtrị']];
    const roundsJackpotItems = rounds
      ? _.zip(
          _.pluck(rounds, 'index'),
          _.map(_.pluck(rounds, 'price'), price => {
            return price / 1000000000;
          })
        )
      : undefined;
    const roundsJackpotData = _.union(roundsJackpotHeader, roundsJackpotItems);

    // Jackpot Round & Count Chart
    const countJackpotHeader = [['x', 'Gtrị', 'Số giải']];
    const countJackpotItems = rounds
      ? _.zip(
          _.pluck(rounds, 'index'),
          _.map(rounds, round => {
            return round.jackpotCount > 0 ? round.price / 1000000000 : 0;
          }),
          _.pluck(rounds, 'jackpotCount')
        )
      : undefined;
    const countJackpotData = _.union(countJackpotHeader, countJackpotItems);

    // Jackpot by Weekday Chart
    const jackpotRounds = rounds
      ? _.filter(rounds, round => {
          return round.jackpotCount > 0;
        })
      : undefined;

    const jackpotOnWed = rounds
      ? _.filter(jackpotRounds, jackpotRound => {
          return new Date(jackpotRound.registered).getDay() === 3;
        })
      : 0;
    const jackpotCountOnWed = rounds ? _.size(jackpotOnWed) : 0;
    const jackpotTicketCountOnWed = rounds
      ? _.reduce(
          jackpotOnWed,
          (memo, round) => {
            return memo + round.jackpotCount;
          },
          0
        )
      : 0;

    const jackpotOnFri = rounds
      ? _.filter(jackpotRounds, jackpotRound => {
          return new Date(jackpotRound.registered).getDay() === 5;
        })
      : 0;
    const jackpotCountOnFri = rounds ? _.size(jackpotOnFri) : 0;
    const jackpotTicketCountOnFri = rounds
      ? _.reduce(
          jackpotOnFri,
          (memo, round) => {
            return memo + round.jackpotCount;
          },
          0
        )
      : 0;

    const jackpotOnSun = rounds
      ? _.filter(jackpotRounds, jackpotRound => {
          return new Date(jackpotRound.registered).getDay() === 0;
        })
      : 0;
    const jackpotCountOnSun = rounds ? _.size(jackpotOnSun) : 0;
    const jackpotTicketCountOnSun = rounds
      ? _.reduce(
          jackpotOnSun,
          (memo, round) => {
            return memo + round.jackpotCount;
          },
          0
        )
      : 0;

    return (
      <div className="container">
        <h1 className="animated fadeIn">Phân tích kết quả Jackpot</h1>
        <h5 className="animated fadeIn mb-4">
          <i>* Kết quả phân tích 50 lượt quay số gần nhất.</i>
        </h5>

        {!roundsReady && <PulseLoader />}
        {roundsReady && (
          <>
            <div className="row animated fadeIn">
              <div className="col-12 mb-4 chart-wrap">
                <Chart
                  width="100%"
                  height="320px"
                  chartType="ColumnChart"
                  loader={<PulseLoader />}
                  data={roundsJackpotData}
                  options={{
                    // Animation
                    animation: {
                      duration: 0,
                      easing: 'out',
                      startup: false,
                    },
                    // Display options
                    fontName: 'Roboto',
                    annotations: { textStyle: { fontName: 'Roboto' } },
                    hAxis: {
                      title: 'Lượt',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                    },
                    legend: {
                      textStyle: { fontName: 'Roboto' },
                    },
                    titleTextStyle: { fontName: 'Roboto', fontSize: '14' },
                    tooltip: {
                      textStyle: { fontName: 'Roboto' },
                    },
                    vAxis: {
                      title: 'Giá trị Jackpot (Tỷ)',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                    },
                    title: 'Giá trị Jackpot theo lượt',
                  }}
                  // For tests
                  rootProps={{ 'data-testid': '1' }}
                />
              </div>
            </div>
            <div className="row animated fadeIn">
              <div className="col-12 mb-4 chart-wrap">
                <Chart
                  width="100%"
                  height="320px"
                  chartType="ColumnChart"
                  loader={<PulseLoader />}
                  data={countJackpotData}
                  options={{
                    // Animation
                    animation: {
                      duration: 0,
                      easing: 'out',
                      startup: false,
                    },
                    // Display options
                    fontName: 'Roboto',
                    annotations: { textStyle: { fontName: 'Roboto' } },
                    hAxis: {
                      title: 'Lượt',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                    },
                    legend: {
                      textStyle: { fontName: 'Roboto' },
                    },
                    titleTextStyle: { fontName: 'Roboto', fontSize: '14' },
                    tooltip: {
                      textStyle: { fontName: 'Roboto' },
                    },
                    vAxis: {
                      title: 'Giá trị Jackpot (Tỷ)',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                    },
                    title: 'Giá trị theo lượt có Jackpot',
                    series: {
                      0: { targetAxisIndex: 0 },
                      1: { targetAxisIndex: 1 },
                    },
                    vAxes: {
                      0: { title: 'Giá trị Jackpot (Tỷ)' },
                      1: { title: 'Số giải' },
                    },
                  }}
                  // For tests
                  rootProps={{ 'data-testid': '1' }}
                />
              </div>
            </div>
            <div className="row animated fadeIn">
              <div className="col-12 mb-4 chart-wrap">
                <Chart
                  width="100%"
                  height="320px"
                  chartType="BarChart"
                  loader={<PulseLoader />}
                  data={[
                    ['X', 'Lượt', 'Số giải'],
                    ['Thứ Tư', jackpotCountOnWed, jackpotTicketCountOnWed],
                    ['Thứ Sáu', jackpotCountOnFri, jackpotTicketCountOnFri],
                    ['Chủ Nhật', jackpotCountOnSun, jackpotTicketCountOnSun],
                  ]}
                  options={{
                    // Animation
                    animation: {
                      duration: 0,
                      easing: 'out',
                      startup: false,
                    },
                    // Display options
                    fontName: 'Roboto',
                    annotations: { textStyle: { fontName: 'Roboto' } },
                    hAxis: {
                      title: 'Jackpot',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                    },
                    legend: {
                      textStyle: { fontName: 'Roboto' },
                    },
                    titleTextStyle: { fontName: 'Roboto', fontSize: '14' },
                    tooltip: {
                      textStyle: { fontName: 'Roboto' },
                    },
                    vAxis: {
                      title: 'Ngày trong tuần',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                    },
                    title: 'Thống kê Jackpot theo ngày trong tuần',
                  }}
                  // For tests
                  rootProps={{ 'data-testid': '2' }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

Jackpot.defaultProps = {
  rounds: null,
};

Jackpot.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  roundsReady: PropTypes.bool.isRequired,
  rounds: Rounds ? PropTypes.array.isRequired : () => null,
};

export default withTracker(() => {
  const roundsSub = Meteor.subscribe('rounds50Latest');
  const rounds = Rounds.find(
    {},
    {
      sort: { index: -1 },
      limit: 50,
    }
  ).fetch();
  const roundsReady = roundsSub.ready() && !!rounds;
  return {
    roundsReady,
    rounds,
    currentUser: Meteor.user(),
  };
})(Jackpot);
