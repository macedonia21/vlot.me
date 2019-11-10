import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import * as Functions from '../../../api/functions.js';

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import OneRoundResult from '../../components/OneRoundResult';
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './Combine8Num.scss';

class Combine8Num extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNums: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    const { loggedIn, roundsReady, rounds } = this.props;
    const { selectedNums } = this.state;

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

                    if (newState && selectedNums.length < 8) {
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
            Chưa chọn đủ bộ 8 số
          </div>
        </div>
      );
    });

    if (selectedNums.length >= 8) {
      const combs8 = ['ABCEFG', 'ABDFGH', 'ACDEFH', 'BCDEFG'];
      const genRounds = Functions.generate(combs8, selectedNums);
      resultRender = _.map(genRounds, genRound => {
        return <OneRoundResult key={genRound.index} roundData={genRound} />;
      });
    }

    return (
      <div className="container analyse-all">
        <h1 className="animated fadeIn">Tổ hợp 8 số</h1>
        <h5 className="animated fadeIn mb-4">
          <i>* Có tất cả 28 bộ 6 số từ 8 số. Phát sinh 4 bộ số.</i>
        </h5>
        <div
          className="btn-block btn-group btn-group-justified btn-group-top mb-4 animated fadeIn"
          role="group"
          aria-label="..."
        >
          <NavLink className="btn btn-default" to="/tohop/8so">
            Tổ hợp 8 số
          </NavLink>
          <NavLink className="btn btn-default" to="/tohop/12so">
            Tổ hợp 12 số
          </NavLink>
          <NavLink className="btn btn-default" to="/tohop/18so">
            Tổ hợp 18 số
          </NavLink>
        </div>
        {!roundsReady && <PulseLoader />}
        {roundsReady && (
          <div className="row animated fadeIn mb-4">
            <div className="col-12 col-sm-4 tool-num-selector-wrap">
              <h3>Chọn 8 số</h3>
              <div className="tool-num-selector mb-4">
                <table>
                  <tbody>{renderNumMatrix}</tbody>
                </table>
              </div>
            </div>
            <div className="col-12 col-sm-8 tool-num-selector-wrap">
              <h3>Kết quả</h3>
              <div className="list-group result-list">{resultRender}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

Combine8Num.defaultProps = {
  rounds: null,
};

Combine8Num.propTypes = {
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
})(Combine8Num);
