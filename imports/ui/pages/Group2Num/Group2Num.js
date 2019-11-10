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

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './Group2Num.scss';

function k_combinations(set, k) {
  let i;
  let j;
  let combs;
  let head;
  let tailcombs;

  if (k > set.length || k <= 0) {
    return [];
  }

  if (k === set.length) {
    return [set];
  }

  if (k === 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    head = set.slice(i, i + 1);
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

// Combine Frequen
function calcCombineFrequen(rounds, setNum) {
  const result = [];
  const frequen = [];

  _.each(rounds, function(round) {
    _.each(k_combinations(_.values(round.result), setNum), function(combine) {
      frequen.push(combine);
    });
  });

  _.each(
    _.countBy(frequen, function(combine) {
      return combine;
    }),
    function(value, key, list) {
      if (value > 1) {
        result.push({
          index: key.split(','),
          count: value,
        });
      }
    }
  );

  return _.sortBy(result, function(combine) {
    return combine.count;
  }).reverse();
}

class Group2Num extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterNum: undefined,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    const { loggedIn, roundsReady, numGroupFrequens } = this.props;
    const { filterNum } = this.state;

    const numGroupShowFrequens =
      filterNum && filterNum >= 1 && filterNum <= 45
        ? _.filter(numGroupFrequens, result => {
            return _.contains(result.index, parseInt(filterNum).toString());
          })
        : numGroupFrequens;

    let group2NumRelateData = null;
    if (filterNum && filterNum >= 1 && filterNum <= 45) {
      // 2 Num Relation Chart
      const group2NumRelateHeader = [['Từ', 'Đến', 'Xhiện']];
      const group2NumRelateItems = _.map(numGroupShowFrequens, group => {
        return [group.index[0], group.index[1], group.count];
      });
      group2NumRelateData = _.union(
        group2NumRelateHeader,
        group2NumRelateItems
      );
    }

    return (
      <div className="container">
        <h1 className="animated fadeIn">Phân tích nhóm 2 số</h1>
        <h5 className="animated fadeIn mb-4">
          <i>* Kết quả phân tích 50 lượt quay số gần nhất.</i>
        </h5>
        <div
          className="btn-block btn-group btn-group-justified btn-group-top mb-4 animated fadeIn"
          role="group"
          aria-label="..."
        >
          <NavLink className="btn btn-default" to="/nhom/2so">
            Nhóm 2 số
          </NavLink>
          <NavLink className="btn btn-default" to="/nhom/3so">
            Nhóm 3 số
          </NavLink>
          <NavLink className="btn btn-default" to="/nhom/4so">
            Nhóm 4 số
          </NavLink>
        </div>
        {!roundsReady && <PulseLoader />}
        {roundsReady && numGroupShowFrequens && (
          <>
            <form>
              <div className="row">
                <div className="col-12 col-sm-4 col-md-3">
                  <div className="form-group">
                    <input
                      type="number"
                      min="1"
                      max="45"
                      className="form-control new-round-result-num"
                      size="2"
                      placeholder="Nhập số cần tìm"
                      value={filterNum || 0}
                      onChange={e => {
                        this.setState({ filterNum: e.target.value });
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
            {filterNum &&
              filterNum >= 1 <= 45 &&
              group2NumRelateData &&
              group2NumRelateData.length > 1 && (
                <div className="row animated fadeIn">
                  <div className="col-12 mb-4 chart-wrap">
                    <Chart
                      width="100%"
                      height="320px"
                      chartType="Sankey"
                      loader={<PulseLoader />}
                      data={group2NumRelateData}
                      options={{
                        // Animation
                        animation: {
                          duration: 0,
                          easing: 'out',
                          startup: false,
                        },
                        // Display options
                        sankey: {
                          node: {
                            width: 10,
                            label: {
                              fontName: 'Roboto',
                              fontSize: 14,
                            },
                          },
                          link: {
                            colorMode: 'gradient',
                          },
                        },
                        tooltip: {
                          textStyle: { fontName: 'Roboto' },
                        },
                      }}
                      rootProps={{ 'data-testid': '1' }}
                    />
                  </div>
                </div>
              )}
            {numGroupShowFrequens.length > 0 && (
              <div className="list-group">
                {_.map(numGroupShowFrequens, (group, index) => {
                  return (
                    <div
                      key={index}
                      className="list-group-item animated fadeIn"
                    >
                      <span className="badge badge-pill badge-warning">
                        {`${group.count} lượt`}
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
            )}
            {numGroupShowFrequens.length <= 0 && (
              <div className="list-group">
                <div className="list-group-item text-center animated fadeIn">
                  {`Không có bộ 2 số nào chứa ${parseInt(
                    filterNum
                  ).toString()} xuất hiện 2 lần trở lên`}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

Group2Num.defaultProps = {
  rounds: null,
  numGroupFrequens: null,
};

Group2Num.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
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
  const numGroupFrequens = calcCombineFrequen(rounds, 2);
  const roundsReady = roundsSub.ready() && !!rounds && !!numGroupFrequens;
  return {
    roundsReady,
    rounds,
    numGroupFrequens,
    currentUser: Meteor.user(),
  };
})(Group2Num);
