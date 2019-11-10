import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { Chart } from 'react-google-charts';
import numeral from 'numeral';

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './Sum.scss';

class Sum extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayNum1: true,
      displayNum2: true,
      displayNum3: true,
      displayNum4: true,
      displayNum5: true,
      displayNum6: true,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    const { loggedIn, roundsReady, rounds } = this.props;

    // Sum Chart
    const roundsSum = _.pluck(rounds, 'sum');
    const sumAvg = Math.round(
      _.reduce(
        roundsSum,
        function(total, roundSum) {
          return total + roundSum;
        },
        0
      ) / roundsSum.length
    );
    const sumHeader = [['x', 'Tổng', 'Tbình']];
    const sumItems = _.map(rounds, round => {
      return [round.index, round.sum, sumAvg];
    });
    const sumData = _.union(sumHeader, sumItems);

    // Group Sum Chart
    const g1Count = _.size(_.where(rounds, { sumType: 'T21 - T67' }));
    const g2Count = _.size(_.where(rounds, { sumType: 'T68 - T114' }));
    const g3Count = _.size(_.where(rounds, { sumType: 'T115 - T161' }));
    const g4Count = _.size(_.where(rounds, { sumType: 'T162 - T208' }));
    const g5Count = _.size(_.where(rounds, { sumType: 'T209 - T255' }));

    return (
      <div className="container analyse-all">
        <h1 className="animated fadeIn">Phân tích tổng bộ số</h1>
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
                  chartType="ComboChart"
                  loader={<PulseLoader />}
                  data={sumData}
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
                      title: 'Tổng',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                    },
                    title: 'Tổng 6 số theo lượt',
                    seriesType: 'bars',
                    series: { 1: { type: 'line' } },
                    // Trend line
                    trendlines: {
                      0: {
                        type: 'exponential',
                        visibleInLegend: true,
                        labelInLegend: 'Trend',
                      },
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
                    ['Nhóm', 'Tổng'],
                    ['T21-T67', g1Count],
                    ['T68-T114', g2Count],
                    ['T115-T161', g3Count],
                    ['T162-T208', g4Count],
                    ['T209-T255', g5Count],
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
                      title: 'Tổng',
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
                      title: 'Nhóm',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                    },
                    title: 'Thống kê tổng theo nhóm',
                    seriesType: 'bars',
                    series: { 1: { type: 'line' } },
                    // Trend line
                    trendlines: {
                      0: {
                        type: 'exponential',
                        visibleInLegend: true,
                        labelInLegend: 'Trend',
                      },
                    },
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

Sum.defaultProps = {
  rounds: null,
};

Sum.propTypes = {
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
})(Sum);
