import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import * as Functions from '../../../api/functions.js';

// Collection
import Rounds from '../../../api/rounds/rounds';
import PredictRounds from '../../../api/predictRounds/predictRounds';

// Components
import OneRoundResult from '../../components/OneRoundResult';
import OneRoundResultMatch from '../../components/OneRoundResultMatch';
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './Forecast.scss';

class Forecast extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    const {
      loggedIn,
      predictRoundsReady,
      predictRounds,
      roundsReady,
      rounds,
    } = this.props;

    let renderForecast = [1].map(() => {
      return (
        <div key="forecastRound" className="list-group">
          <div className="list-group-item text-center animated fadeIn">
            {`Chưa có dự đoán cho lượt tiếp theo`}
          </div>
        </div>
      );
    });

    if (predictRoundsReady && predictRounds[0]) {
      const predictRoundMod = {
        ...predictRounds[0],
        index: `dự đoán ${predictRounds[0].index}`,
      };
      renderForecast = [1].map(() => {
        return (
          <OneRoundResult key="forecastRound" roundData={predictRoundMod} />
        );
      });
    }

    let renderPreviousForecast = [1].map(() => {
      return (
        <div key="previousForecastRound" className="list-group">
          <div className="list-group-item text-center animated fadeIn">
            {`Không có kết quả`}
          </div>
        </div>
      );
    });

    if (predictRoundsReady && predictRounds[1] && roundsReady && rounds[0]) {
      const predictPreviousRoundMod = {
        ...predictRounds[1],
        index: `dự đoán ${predictRounds[1].index}`,
        result: {
          ...predictRounds[1].result,
          num1Matched: _.contains(
            rounds[0].result,
            predictRounds[1].result.num1
          ),
          num2Matched: _.contains(
            rounds[0].result,
            predictRounds[1].result.num2
          ),
          num3Matched: _.contains(
            rounds[0].result,
            predictRounds[1].result.num3
          ),
          num4Matched: _.contains(
            rounds[0].result,
            predictRounds[1].result.num4
          ),
          num5Matched: _.contains(
            rounds[0].result,
            predictRounds[1].result.num5
          ),
          num6Matched: _.contains(
            rounds[0].result,
            predictRounds[1].result.num6
          ),
        },
      };
      renderPreviousForecast = [1].map(() => {
        return (
          <OneRoundResultMatch
            key="previousForecastRound"
            roundData={predictPreviousRoundMod}
          />
        );
      });
    }

    let renderPreviousRound = [1].map(() => {
      return (
        <div key="previousRound" className="list-group">
          <div className="list-group-item text-center animated fadeIn">
            {`Không có kết quả`}
          </div>
        </div>
      );
    });

    if (roundsReady && rounds[0]) {
      renderPreviousRound = [1].map(() => {
        return <OneRoundResult key="previousRound" roundData={rounds[0]} />;
      });
    }

    return (
      <div className="container analyse-all">
        <h1 className="animated fadeIn">Dự đoán kết quả</h1>
        <h5 className="animated fadeIn mb-4">
          <i>* Dự đoán dựa trên kết quả phân tích 50 lượt quay số gần nhất.</i>
        </h5>
        <h5 className="animated fadeIn mb-4">
          <i>
            * Dự đoán mang tính chất tham khảo, không phải là kết quả quay số.
          </i>
        </h5>

        {(!roundsReady || !predictRoundsReady) && <PulseLoader />}
        {roundsReady && predictRoundsReady && (
          <>
            <h3>Dự đoán lượt tiếp theo</h3>
            <div className="row animated fadeIn">
              <div className="col-12">
                <div className="list-group result-list">{renderForecast}</div>
              </div>
            </div>
            <h3>Kết quả dự đoán trước</h3>
            <div className="row animated fadeIn">
              <div className="col-12 col-md-6">
                <div className="list-group result-list">
                  {renderPreviousForecast}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="list-group result-list">
                  {renderPreviousRound}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

Forecast.defaultProps = {
  rounds: null,
  predictRounds: null,
};

Forecast.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  roundsReady: PropTypes.bool.isRequired,
  rounds: Rounds ? PropTypes.array.isRequired : () => null,
  predictRoundsReady: PropTypes.bool.isRequired,
  predictRounds: PredictRounds ? PropTypes.array.isRequired : () => null,
};

export default withTracker(() => {
  const roundsSub = Meteor.subscribe('rounds1Latest');
  const rounds = Rounds.find(
    {},
    {
      sort: { index: -1 },
      limit: 1,
    }
  ).fetch();
  const roundsReady = roundsSub.ready() && !!rounds;

  const predictRoundsSub = Meteor.subscribe('predictRounds2Latest');
  const predictRounds = PredictRounds.find(
    {},
    {
      sort: { index: -1 },
      limit: 2,
    }
  ).fetch();
  const predictRoundsReady = predictRoundsSub.ready() && !!predictRounds;
  return {
    roundsReady,
    rounds,
    predictRoundsReady,
    predictRounds,
    currentUser: Meteor.user(),
  };
})(Forecast);
