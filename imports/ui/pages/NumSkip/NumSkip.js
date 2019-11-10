import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Cleave from 'cleave.js/react';
import { withTracker } from 'meteor/react-meteor-data';
import { Jobs } from 'meteor/msavin:sjobs';
import { Chart } from 'react-google-charts';

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './NumSkip.scss';

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

class NumSkip extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    const { loggedIn, roundsReady, rounds } = this.props;

    // Num Skip Chart
    const skipCount = calcGroupFrequen(
      roundsReady ? rounds[0].skipCount : undefined
    );
    const numSkipCount = roundsReady ? rounds[0].skipCount : undefined;
    const numSkipCountAvg = calcMean(numSkipCount);
    const numSkipCountHeader = [['Số', 'Bước', 'Tbình']];
    const numSkipCountItems = _.map(
      _.zip(_.pluck(numSkipCount, 'index'), _.pluck(numSkipCount, 'count')),
      frequen => {
        frequen.push(numSkipCountAvg);
        return frequen;
      }
    );
    const numSkipCountData = _.union(numSkipCountHeader, numSkipCountItems);

    return (
      <div className="container">
        <h1 className="animated fadeIn">Phân tích bước nhảy</h1>
        <h5 className="animated fadeIn mb-4">
          <i>* Kết quả tính đến lượt quay số gần nhất.</i>
        </h5>
        <h5 className="animated fadeIn mb-4">
          <i>
            * Bước nhảy của một con số là số lượt quay con số đó không xuất hiện
            tính từ lần xuất hiện gần nhất trước đây.
          </i>
        </h5>

        {!roundsReady && <PulseLoader />}
        {roundsReady && numSkipCountData && (
          <div className="row animated fadeIn">
            <div className="col-12 mb-4 chart-wrap">
              <Chart
                width="100%"
                height="320px"
                chartType="ComboChart"
                loader={<PulseLoader />}
                data={numSkipCountData}
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
                    title: 'Bước nhảy',
                    textStyle: { fontName: 'Roboto' },
                    titleTextStyle: { fontName: 'Roboto' },
                  },
                  title: 'Bước nhảy của từng số',
                  seriesType: 'bars',
                  series: { 1: { type: 'line' } },
                }}
                // For tests
                rootProps={{ 'data-testid': '1' }}
              />
            </div>
          </div>
        )}
        {roundsReady && skipCount && (
          <div className="list-group">
            {_.map(skipCount, (skip, index) => {
              return (
                <div key={index} className="list-group-item animated fadeIn">
                  <span className="badge badge-pill badge-warning">
                    {`${skip.count} lượt`}
                  </span>
                  <div className="list-group-item-text round-result">
                    {_.map(skip.index, (num, indx) => {
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
      </div>
    );
  }
}

NumSkip.defaultProps = {
  rounds: null,
};

NumSkip.propTypes = {
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
      limit: 1,
    }
  ).fetch();
  const roundsReady = roundsSub.ready() && !!rounds;
  return {
    roundsReady,
    rounds,
    currentUser: Meteor.user(),
  };
})(NumSkip);
