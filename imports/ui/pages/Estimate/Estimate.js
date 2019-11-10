import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import * as Functions from '../../../api/functions.js';

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import OneRoundResult from '../../components/OneRoundResult';
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './Estimate.scss';

class Estimate extends React.Component {
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
            Chưa chọn đủ bộ 6 số
          </div>
        </div>
      );
    });

    let propabilityInfo;

    if (selectedNums.length >= 6) {
      const sortedSelectedNums = _.sortBy(selectedNums, num => {
        return num;
      });
      const odd = _.size(
        _.filter(sortedSelectedNums, num => {
          return num % 2 === 1;
        })
      );
      const even = _.size(
        _.filter(sortedSelectedNums, num => {
          return num % 2 === 0;
        })
      );
      const low = _.size(
        _.filter(sortedSelectedNums, num => {
          return num < 23;
        })
      );
      const high = _.size(
        _.filter(sortedSelectedNums, num => {
          return num > 22;
        })
      );
      const sum = _.reduce(
        sortedSelectedNums,
        function(memo, num) {
          return memo + num;
        },
        0
      );
      let sumType;
      if (sum >= 21 && sum <= 67) {
        sumType = 'T21 - T67';
      } else if (sum >= 68 && sum <= 114) {
        sumType = 'T68 - T114';
      } else if (sum >= 115 && sum <= 161) {
        sumType = 'T115 - T161';
      } else if (sum >= 162 && sum <= 208) {
        sumType = 'T162 - T208';
      } else if (sum >= 209 && sum <= 255) {
        sumType = 'T209 - T255';
      }
      const oddEvenType = `C${even} / ${odd}L`;
      const lowHighType = `T${high} / ${low}X`;
      const lastNumType = Functions.getLastNumType(sortedSelectedNums);
      const seqNumType = Functions.getSequenceType(sortedSelectedNums);
      const examRound = {
        index: 'đánh giá',
        isJackpot: false,
        jackpotCount: 0,
        price: 12000000000,
        result: {
          num1: sortedSelectedNums[0],
          num2: sortedSelectedNums[1],
          num3: sortedSelectedNums[2],
          num4: sortedSelectedNums[3],
          num5: sortedSelectedNums[4],
          num6: sortedSelectedNums[5],
        },
        odd,
        even,
        low,
        high,
        sum,
        oddEvenType,
        lowHighType,
        sumType,
        lastNumType,
        seqNumType,
      };
      resultRender = [1].map(() => {
        return <OneRoundResult key="examRound" roundData={examRound} />;
      });

      // Propability
      const oddEvenInfo = [1].map(() => {
        switch (oddEvenType) {
          case 'C0 / 6L':
            return (
              <tr key={oddEvenType}>
                <th>C0 / 6L</th>
                <td>0 số Chẵn, 6 số Lẻ</td>
                <td>100.947</td>
                <td>1,24%</td>
              </tr>
            );
          case 'C1 / 5L':
            return (
              <tr key={oddEvenType}>
                <th>C1 / 5L</th>
                <td>1 số Chẵn, 5 số Lẻ</td>
                <td>740.278</td>
                <td>9,09%</td>
              </tr>
            );
          case 'C2 / 4L':
            return (
              <tr key={oddEvenType} className="bg-light">
                <th>C2 / 4L</th>
                <td>2 số Chẵn, 4 số Lẻ</td>
                <td>2.045.505</td>
                <td>25,11%</td>
              </tr>
            );
          case 'C3 / 3L':
            return (
              <tr key={oddEvenType} className="bg-light">
                <th>C3 / 3L</th>
                <td>3 số Chẵn, 3 số Lẻ</td>
                <td>2.727.340</td>
                <td>33,48%</td>
              </tr>
            );
          case 'C4 / 2L':
            return (
              <tr key={oddEvenType} className="bg-light">
                <th>C4 / 2L</th>
                <td>4 số Chẵn, 2 số Lẻ</td>
                <td>1.850.695</td>
                <td>22,72%</td>
              </tr>
            );
          case 'C5 / 1L':
            return (
              <tr key={oddEvenType}>
                <th>C5 / 1L</th>
                <td>5 số Chẵn, 1 số Lẻ</td>
                <td>605.682</td>
                <td>7,44%</td>
              </tr>
            );
          case 'C6 / 0L':
            return (
              <tr key={oddEvenType}>
                <th>C6 / 0L</th>
                <td>6 số Chẵn, 0 số Lẻ</td>
                <td>74.613</td>
                <td>0,92%</td>
              </tr>
            );
          default:
        }
      });
      const lowHighInfo = [1].map(() => {
        switch (lowHighType) {
          case 'T0 / 6X':
            return (
              <tr key={lowHighType}>
                <th>T0 / 6X</th>
                <td>0 số Tài, 6 số Xỉu</td>
                <td>74.613</td>
                <td>0,92%</td>
              </tr>
            );
          case 'T1 / 5X':
            return (
              <tr key={lowHighType}>
                <th>T1 / 5X</th>
                <td>1 số Tài, 5 số Xỉu</td>
                <td>605.682</td>
                <td>7,44%</td>
              </tr>
            );
          case 'T2 / 4X':
            return (
              <tr key={lowHighType} className="bg-light">
                <th>T2 / 4X</th>
                <td>2 số Tài, 4 số Xỉu</td>
                <td>1.850.695</td>
                <td>22,72%</td>
              </tr>
            );
          case 'T3 / 3X':
            return (
              <tr key={lowHighType} className="bg-light">
                <th>T3 / 3X</th>
                <td>3 số Tài, 3 số Xỉu</td>
                <td>2.727.340</td>
                <td>33,48%</td>
              </tr>
            );
          case 'T4 / 2X':
            return (
              <tr key={lowHighType} className="bg-light">
                <th>T4 / 2X</th>
                <td>4 số Tài, 2 số Xỉu</td>
                <td>2.045.505</td>
                <td>25,11%</td>
              </tr>
            );
          case 'T5 / 1X':
            return (
              <tr key={lowHighType}>
                <th>T5 / 1X</th>
                <td>5 số Tài, 1 số Xỉu</td>
                <td>740.278</td>
                <td>9,09%</td>
              </tr>
            );
          case 'T6 / 0X':
            return (
              <tr key={lowHighType}>
                <th>T6 / 0X</th>
                <td>6 số Tài, 0 số Xỉu</td>
                <td>100.947</td>
                <td>1,24%</td>
              </tr>
            );
          default:
        }
      });
      const sumInfo = [1].map(() => {
        switch (sumType) {
          case 'T21 - T67':
            return (
              <tr key={sumType}>
                <th>T21 - T67</th>
                <td>Tổng 6 số từ 21 đến 67</td>
                <td>63.763</td>
                <td>0,78%</td>
              </tr>
            );
          case 'T68 - T114':
            return (
              <tr key={sumType} className="bg-light">
                <th>T68 - T114</th>
                <td>Tổng 6 số có từ 68 đến 114</td>
                <td>1.737.866</td>
                <td>21,34%</td>
              </tr>
            );
          case 'T115 - T161':
            return (
              <tr key={sumType} className="bg-light">
                <th>T115 - T161</th>
                <td>Tổng 6 số có từ 115 đến 161</td>
                <td>4.541.802</td>
                <td>55,76%</td>
              </tr>
            );
          case 'T162 - T208':
            return (
              <tr key={sumType} className="bg-light">
                <th>T162 - T208</th>
                <td>Tổng 6 số có từ 162 đến 208</td>
                <td>1.737.866</td>
                <td>21,34%</td>
              </tr>
            );
          case 'T209 - T255':
            return (
              <tr key={sumType}>
                <th>T209 - T255</th>
                <td>Tổng 6 số có từ 209 đến 255</td>
                <td>63.763</td>
                <td>0,78%</td>
              </tr>
            );
          default:
        }
      });
      const lastNumInfo = [1].map(() => {
        switch (lastNumType) {
          case 'Đ6':
            return (
              <tr key={lastNumType} className="bg-light">
                <th>Đ6</th>
                <td>6 số đuôi khác nhau</td>
                <td>1.708.100</td>
                <td>20,97%</td>
              </tr>
            );
          case 'Đ5':
            return (
              <tr key={lastNumType} className="bg-light">
                <th>Đ5</th>
                <td>5 số đuôi khác nhau</td>
                <td>4.048.680</td>
                <td>49,71%</td>
              </tr>
            );
          case 'Đ4':
            return (
              <tr key="Đ4" className="bg-light">
                <th>Đ4</th>
                <td>4 số đuôi khác nhau</td>
                <td>1.850.695</td>
                <td>22,72%</td>
              </tr>
            );
          case 'Đ3':
            return (
              <tr key={lastNumType}>
                <th>Đ3</th>
                <td>3 số đuôi khác nhau</td>
                <td>259.600</td>
                <td>3,19%</td>
              </tr>
            );
          case 'Đ2':
            return (
              <tr key={lastNumType}>
                <th>Đ2</th>
                <td>2 số đuôi khác nhau</td>
                <td>4.280</td>
                <td>0,05%</td>
              </tr>
            );
          case 'Đ1':
            return (
              <tr key={lastNumType}>
                <th>Đ1</th>
                <td>6 số đuôi bằng nhau</td>
                <td>0</td>
                <td>0,00%</td>
              </tr>
            );
          default:
        }
      });
      const seqNumInfo = [1].map(() => {
        switch (seqNumType) {
          case 'L0':
            return (
              <tr key={seqNumType} className="bg-light">
                <th>L0</th>
                <td>Không xuất hiện cặp số liên tiếp</td>
                <td>3.838.380</td>
                <td>47,13%</td>
              </tr>
            );
          case 'L2':
            return (
              <tr key={seqNumType} className="bg-light">
                <th>L2</th>
                <td>1 cặp số liên tiếp</td>
                <td>3.290.040</td>
                <td>40,39%</td>
              </tr>
            );
          case 'L2L2':
            return (
              <tr key={seqNumType}>
                <th>L2L2</th>
                <td>2 cặp số liên tiếp</td>
                <td>548.340</td>
                <td>6,73%</td>
              </tr>
            );
          case 'L2L2L2':
            return (
              <tr key={seqNumType}>
                <th>L2L2L2</th>
                <td>3 cặp số liên tiếp</td>
                <td>9.880</td>
                <td>0,12%</td>
              </tr>
            );
          case 'L3':
            return (
              <tr key={seqNumType}>
                <th>L3</th>
                <td>3 số liên tiếp nhau</td>
                <td>365.560</td>
                <td>4,49%</td>
              </tr>
            );
          case 'L3L2':
            return (
              <tr key={seqNumType}>
                <th>L3L2</th>
                <td>3 số liên tiếp và 1 cặp số liên tiếp</td>
                <td>59.280</td>
                <td>0,73%</td>
              </tr>
            );
          case 'L3L3':
            return (
              <tr key={seqNumType}>
                <th>L3L3</th>
                <td>3 số liên tiếp và 3 số liên tiếp</td>
                <td>780</td>
                <td>0,01%</td>
              </tr>
            );
          case 'L4':
            return (
              <tr key={seqNumType}>
                <th>L4</th>
                <td>4 số liên tiếp</td>
                <td>29.640</td>
                <td>0,36%</td>
              </tr>
            );
          case 'L4L2':
            return (
              <tr key={seqNumType}>
                <th>L4L2</th>
                <td>4 số liên tiếp và 1 cặp số liên tiếp</td>
                <td>1.560</td>
                <td>0,02%</td>
              </tr>
            );
          case 'L5':
            return (
              <tr key={seqNumType}>
                <th>L5</th>
                <td>5 số liên tiếp</td>
                <td>1.560</td>
                <td>0,02%</td>
              </tr>
            );
          case 'L6':
            return (
              <tr key={seqNumType}>
                <th>L6</th>
                <td>6 số liên tiếp</td>
                <td>40</td>
                <td>0,00%</td>
              </tr>
            );
          default:
        }
      });

      propabilityInfo = [1].map(() => {
        return (
          <table key="1" className="table">
            <thead>
              <tr key="propHead">
                <th>Ký hiệu</th>
                <th>Ý nghĩa</th>
                <th>Bộ số</th>
                <th>Tỉ lệ</th>
              </tr>
            </thead>
            <tbody>
              {oddEvenInfo}
              {lowHighInfo}
              {sumInfo}
              {lastNumInfo}
              {seqNumInfo}
            </tbody>
          </table>
        );
      });
    }

    return (
      <div className="container analyse-all">
        <h1 className="animated fadeIn">Đánh giá bộ số</h1>
        <h5 className="animated fadeIn mb-4">
          <i>* Chọn 1 bộ 6 số để đánh giá xác xuất.</i>
        </h5>

        {!roundsReady && <PulseLoader />}
        {roundsReady && (
          <div className="row animated fadeIn mb-4">
            <div className="col-12 col-sm-4 tool-num-selector-wrap">
              <h3>Chọn 6 số</h3>
              <div className="tool-num-selector mb-4">
                <table>
                  <tbody>{renderNumMatrix}</tbody>
                </table>
              </div>
            </div>
            <div className="col-12 col-sm-8 tool-num-selector-wrap">
              <h3>Kết quả</h3>
              <div className="list-group result-list">{resultRender}</div>
              {propabilityInfo}
            </div>
          </div>
        )}
      </div>
    );
  }
}

Estimate.defaultProps = {
  rounds: null,
};

Estimate.propTypes = {
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
})(Estimate);
