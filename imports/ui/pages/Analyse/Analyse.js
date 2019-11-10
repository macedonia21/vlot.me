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
import './Analyse.scss';

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
// Overall frequen
function calcFrequen(rounds) {
  const frequen = [];
  _.each(
    _.countBy(
      _.flatten(
        _.map(rounds, function(round) {
          return _.values(round.result);
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
// Number 1 frequen
function calcNum1Frequen(rounds) {
  const frequen = [];
  _.each(
    _.countBy(
      _.flatten(
        _.map(rounds, function(round) {
          return _.first(_.values(round.result));
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
// Number 2 frequen
function calcNum2Frequen(rounds) {
  const frequen = [];
  _.each(
    _.countBy(
      _.flatten(
        _.map(rounds, function(round) {
          return _.filter(_.values(round.result), function(item, index) {
            return index === 1;
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
// Number 4 frequen
function calcNum4Frequen(rounds) {
  const frequen = [];
  _.each(
    _.countBy(
      _.flatten(
        _.map(rounds, function(round) {
          return _.filter(_.values(round.result), function(item, index) {
            return index === 3;
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
// Number 5 frequen
function calcNum5Frequen(rounds) {
  const frequen = [];
  _.each(
    _.countBy(
      _.flatten(
        _.map(rounds, function(round) {
          return _.filter(_.values(round.result), function(item, index) {
            return index === 4;
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
// Number 6 frequen
function calcNum6Frequen(rounds) {
  const frequen = [];
  _.each(
    _.countBy(
      _.flatten(
        _.map(rounds, function(round) {
          return _.filter(_.values(round.result), function(item, index) {
            return index === 5;
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
// Each number frequen on 45
function calcNum45Frequen(numFrequen) {
  const frequen = [];
  const orderArray = _.range(1, 46);
  _.each(orderArray, function(value, key, list) {
    const item = _.filter(numFrequen, function(freq) {
      return freq.index === value;
    });
    if (item[0] && item[0].count > 0) {
      frequen.push(item[0].count);
    } else {
      frequen.push(0);
    }
  });
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

class Analyse extends React.Component {
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
    const { loggedIn, roundsReady, rounds, numGroupFrequens } = this.props;
    const {
      displayNum1,
      displayNum2,
      displayNum3,
      displayNum4,
      displayNum5,
      displayNum6,
    } = this.state;

    // Rate Chart
    const roundsFrequen = calcFrequen(rounds);
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

    // Rate 6 Chart
    const roundsNumDummyFrequen = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    const roundsNum1Frequen = displayNum1
      ? calcNum45Frequen(calcNum1Frequen(rounds))
      : roundsNumDummyFrequen;
    const roundsNum2Frequen = displayNum2
      ? calcNum45Frequen(calcNum2Frequen(rounds))
      : roundsNumDummyFrequen;
    const roundsNum3Frequen = displayNum3
      ? calcNum45Frequen(calcNum3Frequen(rounds))
      : roundsNumDummyFrequen;
    const roundsNum4Frequen = displayNum4
      ? calcNum45Frequen(calcNum4Frequen(rounds))
      : roundsNumDummyFrequen;
    const roundsNum5Frequen = displayNum5
      ? calcNum45Frequen(calcNum5Frequen(rounds))
      : roundsNumDummyFrequen;
    const roundsNum6Frequen = displayNum6
      ? calcNum45Frequen(calcNum6Frequen(rounds))
      : roundsNumDummyFrequen;
    const rounds6PosFrequenHeader = [
      ['Số', 'Vtrí 1', 'Vtrí 2', 'Vtrí 3', 'Vtrí 4', 'Vtrí 5', 'Vtrí 6'],
    ];
    const rounds6PosFrequenItems = _.zip(
      _.pluck(roundsFrequen, 'index'),
      roundsNum1Frequen,
      roundsNum2Frequen,
      roundsNum3Frequen,
      roundsNum4Frequen,
      roundsNum5Frequen,
      roundsNum6Frequen
    );
    const rounds6PosFrequenData = _.union(
      rounds6PosFrequenHeader,
      rounds6PosFrequenItems
    );

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
      <div className="container">
        <h1 className="animated fadeIn">Phân tích bộ số</h1>
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
              <div className="col-12 mb-4 chart-wrap">
                <Chart
                  width="100%"
                  height="320px"
                  chartType="ColumnChart"
                  loader={<PulseLoader />}
                  data={rounds6PosFrequenData}
                  options={{
                    // Animation
                    animation: {
                      duration: 1000,
                      easing: 'out',
                      startup: true,
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
                    title: 'Số lần xuất hiện theo vị trí',
                    isStacked: true,
                  }}
                  // For tests
                  rootProps={{ 'data-testid': '2' }}
                  chartEvents={[
                    {
                      eventName: 'select',
                      callback: ({ chartWrapper }) => {
                        const chart = chartWrapper.getChart();
                        const selection = chart.getSelection();

                        for (let i = 0; i < selection.length; i++) {
                          const item = selection[i];
                          if (item.row !== null && item.column !== null) {
                            // No thing
                          } else if (item.row !== null) {
                            // No thing
                          } else if (item.column !== null) {
                            // Trigger data display
                            if (item.column === 1) {
                              this.setState({ displayNum1: !displayNum1 });
                            } else if (item.column === 2) {
                              this.setState({ displayNum2: !displayNum2 });
                            } else if (item.column === 3) {
                              this.setState({ displayNum3: !displayNum3 });
                            } else if (item.column === 4) {
                              this.setState({ displayNum4: !displayNum4 });
                            } else if (item.column === 5) {
                              this.setState({ displayNum5: !displayNum5 });
                            } else if (item.column === 6) {
                              this.setState({ displayNum6: !displayNum6 });
                            }
                          }
                        }
                      },
                    },
                  ]}
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
              {_.map(numGroupFrequens, (group, index) => {
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

Analyse.defaultProps = {
  rounds: null,
  numGroupFrequens: null,
};

Analyse.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  roundsReady: PropTypes.bool.isRequired,
  rounds: Rounds ? PropTypes.array.isRequired : () => null,
  numGroupFrequens: PropTypes.array,
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
  const numGroupFrequens = calcGroupFrequen(calcFrequen(rounds));
  const roundsReady = roundsSub.ready() && !!rounds && !!numGroupFrequens;
  return {
    roundsReady,
    rounds,
    numGroupFrequens,
    currentUser: Meteor.user(),
  };
})(Analyse);
