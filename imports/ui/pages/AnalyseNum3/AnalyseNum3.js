import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { Chart } from 'react-google-charts';

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import OneRoundResult from '../../components/OneRoundResult';
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './AnalyseNum3.scss';

// Group frequen
function calcGroupFrequen(frequen) {
  const groupFrequenObj = _.groupBy(frequen, function(frequen) {
    return frequen.count;
  });
  const groupFrequen = [];
  for (const property in groupFrequenObj) {
    if (groupFrequenObj.hasOwnProperty(property)) {
      groupFrequen.push({
        index: _.pluck(groupFrequenObj[property], 'index'),
        count: parseInt(property),
      });
    }
  }
  return _.sortBy(groupFrequen, function(frequen) {
    return frequen.count;
  }).reverse();
}
// Overall average
function calcMean(frequen) {
  if (!frequen || frequen.length === 0) {
    return 0;
  }
  return (
    _.reduce(
      frequen,
      function(memo, frequen) {
        return memo + frequen.count;
      },
      0
    ) / frequen.length
  );
}
// Number 3 frequen
function calcNum3Frequen(rounds) {
  const frequen = [];
  _.each(
    _.countBy(
      _.flatten(
        _.map(rounds, function(round) {
          return _.filter(_.values(round.result), function(item, index) {
            return index === 2;
          });
        })
      ),
      function(obj) {
        return obj;
      }
    ),
    function(value, key, list) {
      frequen.push({
        index: parseInt(key),
        count: value,
      });
    }
  );
  return frequen;
}
// Odd Even
function calcOddEven(frequen) {
  const result = [];
  result.push(
    _.reduce(
      frequen,
      function(memo, frequen) {
        return frequen.index % 2 === 0 ? memo + frequen.count : memo;
      },
      0
    )
  );
  result.push(
    _.reduce(
      frequen,
      function(memo, frequen) {
        return frequen.index % 2 === 1 ? memo + frequen.count : memo;
      },
      0
    )
  );
  return result;
}
// Low High
function calcLowHigh(frequen) {
  const result = [];
  result.push(
    _.reduce(
      frequen,
      function(memo, frequen) {
        return frequen.index >= 23 ? memo + frequen.count : memo;
      },
      0
    )
  );
  result.push(
    _.reduce(
      frequen,
      function(memo, frequen) {
        return frequen.index < 23 ? memo + frequen.count : memo;
      },
      0
    )
  );
  return result;
}

class AnalyseNum3 extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    const { loggedIn, roundsReady, rounds, numNumFrequens } = this.props;

    // Rate Chart
    const roundsFrequen = calcNum3Frequen(rounds);
    const roundsAvg = calcMean(roundsFrequen);
    const roundsFrequenHeader = [['Số', 'Xhiện', 'Tbình']];
    const roundsFrequenItems = _.map(
      _.zip(_.pluck(roundsFrequen, 'index'), _.pluck(roundsFrequen, 'count')),
      frequen => {
        frequen.push(roundsAvg);
        return frequen;
      }
    );
    const roundsFrequenData = _.union(roundsFrequenHeader, roundsFrequenItems);

    // Odd Even
    const oeHeader = [['Chẵn/Lẻ', 'Xhiện']];
    const oeRaw = calcOddEven(roundsFrequen);
    const oeItems = [
      ['Chẵn', oeRaw[0] ? oeRaw[0] : 0],
      ['Lẻ', oeRaw[1] ? oeRaw[1] : 0],
    ];
    const oeData = _.union(oeHeader, oeItems);

    // Low High
    const lhHeader = [['Tài/Xỉu', 'Xhiện']];
    const lhRaw = calcLowHigh(roundsFrequen);
    const lhItems = [
      ['Tài', lhRaw[0] ? lhRaw[0] : 0],
      ['Xỉu', lhRaw[1] ? lhRaw[1] : 0],
    ];
    const lhData = _.union(lhHeader, lhItems);

    return (
      <div className="container analyse-all">
        <h1 className="animated fadeIn">Phân tích vị trí số 3</h1>
        <h5 className="animated fadeIn mb-4">
          <i>* Kết quả phân tích 50 lượt quay số gần nhất.</i>
        </h5>
        <div
          className="btn-block btn-group btn-group-justified btn-group-top mb-4 animated fadeIn"
          role="group"
          aria-label="..."
        >
          <NavLink className="btn btn-default" to="/phantich">
            Bộ số
          </NavLink>
          <NavLink className="btn btn-default" to="/phantich/so1">
            Số 1
          </NavLink>
          <NavLink className="btn btn-default" to="/phantich/so2">
            Số 2
          </NavLink>
          <NavLink className="btn btn-default" to="/phantich/so3">
            Số 3
          </NavLink>
          <NavLink className="btn btn-default" to="/phantich/so4">
            Số 4
          </NavLink>
          <NavLink className="btn btn-default" to="/phantich/so5">
            Số 5
          </NavLink>
          <NavLink className="btn btn-default" to="/phantich/so6">
            Số 6
          </NavLink>
        </div>
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
                  data={roundsFrequenData}
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
                      title: 'Số',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                      minValue: 1,
                      maxValue: 45,
                    },
                    legend: {
                      textStyle: { fontName: 'Roboto' },
                    },
                    titleTextStyle: { fontName: 'Roboto', fontSize: '14' },
                    tooltip: {
                      textStyle: { fontName: 'Roboto' },
                    },
                    vAxis: {
                      title: 'Lần xuất hiện',
                      textStyle: { fontName: 'Roboto' },
                      titleTextStyle: { fontName: 'Roboto' },
                    },
                    title: 'Số lần xuất hiện trong bộ số',
                    seriesType: 'bars',
                    series: { 1: { type: 'line' } },
                  }}
                  // For tests
                  rootProps={{ 'data-testid': '1' }}
                />
              </div>
            </div>

            <div className="row animated fadeIn">
              <div className="col-md-6 mb-4 chart-wrap">
                <Chart
                  width="100%"
                  height="320px"
                  chartType="PieChart"
                  loader={<PulseLoader />}
                  data={oeData}
                  options={{
                    fontName: 'Roboto',
                    legend: { textStyle: { fontName: 'Roboto' } },
                    pieSliceTextStyle: { fontName: 'Roboto' },
                    titleTextStyle: { fontName: 'Roboto', fontSize: '14' },
                    tooltip: { textStyle: { fontName: 'Roboto' } },
                    title: 'Tỉ lệ số Chẵn Lẻ',
                    slices: {
                      1: { offset: 0 },
                    },
                  }}
                  rootProps={{ 'data-testid': '3' }}
                />
              </div>
              <div className="col-md-6 mb-4 chart-wrap">
                <Chart
                  width="100%"
                  height="320px"
                  chartType="PieChart"
                  loader={<PulseLoader />}
                  data={lhData}
                  options={{
                    fontName: 'Roboto',
                    legend: { textStyle: { fontName: 'Roboto' } },
                    pieSliceTextStyle: { fontName: 'Roboto' },
                    titleTextStyle: { fontName: 'Roboto', fontSize: '14' },
                    tooltip: { textStyle: { fontName: 'Roboto' } },
                    title: 'Tỉ lệ số Tài Xỉu',
                    slices: {
                      1: { offset: 0 },
                    },
                  }}
                  rootProps={{ 'data-testid': '4' }}
                />
              </div>
            </div>

            <div className="list-group">
              {_.map(numNumFrequens, (group, index) => {
                return (
                  <div key={index} className="list-group-item animated fadeIn">
                    <span className="badge badge-pill badge-warning">
                      {`${group.count} lần`}
                    </span>
                    <div className="list-group-item-text round-result">
                      {_.map(group.index, (num, indx) => {
                        return (
                          <span key={indx} className="round-result-num-small">
                            {num}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }
}

AnalyseNum3.defaultProps = {
  rounds: null,
  numNumFrequens: null,
};

AnalyseNum3.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  roundsReady: PropTypes.bool.isRequired,
  rounds: Rounds ? PropTypes.array.isRequired : () => null,
  numNumFrequens: PropTypes.array,
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
  const numNumFrequens = calcGroupFrequen(
    calcNum3Frequen(rounds)
  );
  const roundsReady = roundsSub.ready() && !!rounds && !!numNumFrequens;
  return {
    roundsReady,
    rounds,
    numNumFrequens,
    currentUser: Meteor.user(),
  };
})(AnalyseNum3);
