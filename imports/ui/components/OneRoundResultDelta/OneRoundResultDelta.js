import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import numeral from 'numeral';

import '../../../api/moment_vi.js';
import '../../../api/numeral_vi.js';

numeral.locale('vi');

class OneRoundResultDelta extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState || this.props !== nextProps;
  }

  render() {
    const { roundData } = this.props;

    const jackpotCountSymbol = _.map(
      [...Array(roundData.jackpotCount)],
      (item, index) => {
        return (
          <span
            key={index}
            className="fa fa-certificate text-danger ml-1 mr-1"
          />
        );
      }
    );

    return (
      <div className="list-group-item fadeIn animated">
        <div className="row">
          <div className="col-md-6 col-sm-8 col-8">
            <h4 className="list-group-item-heading d-none d-sm-block">
              {moment(roundData.registered)
                .locale('vi')
                .format('LLLL')}
            </h4>
            <h4 className="list-group-item-heading d-block d-sm-none">
              {moment(roundData.registered)
                .locale('vi')
                .format('llll')}
            </h4>
          </div>
          <div className="col-md-6 col-sm-4 col-4 text-right">
            <span className="badge badge-pill badge-warning">
              {`Lượt ${roundData.index}`}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h4 className="list-group-item-heading">
              {numeral(roundData.price).format('0,0')}
              &nbsp;
              {jackpotCountSymbol}
              &nbsp;
              {roundData.jackpotCount > 0 && (
                <span className="badge badge-pill badge-warning">Jackpot</span>
              )}
            </h4>
          </div>
        </div>
        <div className="list-group-item-text round-result result-num">
          <span className="round-result-num delta-faded fadeIn animated">
            {roundData.result.num1}
          </span>
          <span className="round-result-num delta-num">
            <span className="fa fa-caret-left mr-1" />
            {roundData.delta.num1}
            <span className="fa fa-caret-right ml-1" />
          </span>
          <span className="round-result-num delta-faded fadeIn animated">
            {roundData.result.num2}
          </span>
          <span className="round-result-num delta-num">
            <span className="fa fa-caret-left mr-1" />
            {roundData.delta.num2}
            <span className="fa fa-caret-right ml-1" />
          </span>
          <span className="round-result-num delta-faded fadeIn animated">
            {roundData.result.num3}
          </span>
          <span className="round-result-num delta-num">
            <span className="fa fa-caret-left mr-1" />
            {roundData.delta.num3}
            <span className="fa fa-caret-right ml-1" />
          </span>
          <span className="round-result-num delta-faded fadeIn animated">
            {roundData.result.num4}
          </span>
          <span className="round-result-num delta-num">
            <span className="fa fa-caret-left mr-1" />
            {roundData.delta.num4}
            <span className="fa fa-caret-right ml-1" />
          </span>
          <span className="round-result-num delta-faded fadeIn animated">
            {roundData.result.num5}
          </span>
          <span className="round-result-num delta-num">
            <span className="fa fa-caret-left mr-1" />
            {roundData.delta.num5}
            <span className="fa fa-caret-right ml-1" />
          </span>
          <span className="round-result-num delta-faded fadeIn animated">
            {roundData.result.num6}
          </span>
          <div className="list-group-item-text round-result result-stat">
            <a className="round-result-char-link" href="/xacsuat#chanle">
              <span
                className="round-result-stat"
                data-tip
                data-for={`C${roundData.even}-${roundData.odd}L`}
              >
                {`C${roundData.even} / ${roundData.odd}L`}
              </span>
            </a>
            <ReactTooltip id="C0-6L" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Chẵn Lẻ</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Chẵn và 23 số Lẻ</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>C0 / 6L</th>
                        <td>0 số Chẵn, 6 số Lẻ</td>
                        <td>100.947</td>
                        <td>1,24%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="C1-5L" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Chẵn Lẻ</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Chẵn và 23 số Lẻ</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>C1 / 5L</th>
                        <td>1 số Chẵn, 5 số Lẻ</td>
                        <td>740.278</td>
                        <td>9,09%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="C2-4L" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Chẵn Lẻ</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Chẵn và 23 số Lẻ</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>C2 / 4L</th>
                        <td>2 số Chẵn, 4 số Lẻ</td>
                        <td>2.045.505</td>
                        <td>25,11%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="C3-3L" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Chẵn Lẻ</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Chẵn và 23 số Lẻ</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>C3 / 3L</th>
                        <td>3 số Chẵn, 3 số Lẻ</td>
                        <td>2.727.340</td>
                        <td>33,48%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="C4-2L" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Chẵn Lẻ</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Chẵn và 23 số Lẻ</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>C4 / 2L</th>
                        <td>4 số Chẵn, 2 số Lẻ</td>
                        <td>1.850.695</td>
                        <td>22,72%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="C5-1L" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Chẵn Lẻ</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Chẵn và 23 số Lẻ</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>C5 / 1L</th>
                        <td>5 số Chẵn, 1 số Lẻ</td>
                        <td>605.682</td>
                        <td>7,44%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="C6-0L" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Chẵn Lẻ</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Chẵn và 23 số Lẻ</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>C6 / 0L</th>
                        <td>6 số Chẵn, 0 số Lẻ</td>
                        <td>74.613</td>
                        <td>0,92%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <a className="round-result-char-link" href="/xacsuat#taixiu">
              <span
                className="round-result-stat"
                data-tip
                data-for={`T${roundData.high}-${roundData.low}X`}
              >
                {`T${roundData.high} / ${roundData.low}X`}
              </span>
            </a>
            <ReactTooltip id="T0-6X" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Tài Xỉu</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Xỉu và 23 số Tài</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T0 / 6X</th>
                        <td>0 số Tài, 6 số Xỉu</td>
                        <td>74.613</td>
                        <td>0,92%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="T1-5X" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Tài Xỉu</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Xỉu và 23 số Tài</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T1 / 5X</th>
                        <td>1 số Tài, 5 số Xỉu</td>
                        <td>605.682</td>
                        <td>7,44%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="T2-4X" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Tài Xỉu</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Xỉu và 23 số Tài</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T2 / 4X</th>
                        <td>2 số Tài, 4 số Xỉu</td>
                        <td>1.850.695</td>
                        <td>22,72%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="T3-3X" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Tài Xỉu</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Xỉu và 23 số Tài</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T3 / 3X</th>
                        <td>3 số Tài, 3 số Xỉu</td>
                        <td>2.727.340</td>
                        <td>33,48%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="T4-2X" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Tài Xỉu</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Xỉu và 23 số Tài</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T4 / 2X</th>
                        <td>4 số Tài, 2 số Xỉu</td>
                        <td>2.045.505</td>
                        <td>25,11%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="T5-1X" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Tài Xỉu</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Xỉu và 23 số Tài</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T5 / 1X</th>
                        <td>5 số Tài, 1 số Xỉu</td>
                        <td>740.278</td>
                        <td>9,09%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="T6-0X" place="top" type="light" effect="solid">
              <h4 className="mt-4">Tỉ lệ Tài Xỉu</h4>
              <p>Tập hợp các số từ 01 đến 45 gồm có 22 số Xỉu và 23 số Tài</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T6 / 0X</th>
                        <td>6 số Tài, 0 số Xỉu</td>
                        <td>100.947</td>
                        <td>1,24%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <a className="round-result-char-link" href="/xacsuat#tong">
              <span
                className="round-result-stat"
                data-tip
                data-for={roundData.sumType}
              >
                {`T${roundData.sum}`}
              </span>
            </a>
            <ReactTooltip
              id="T21 - T67"
              place="top"
              type="light"
              effect="solid"
            >
              <h4 className="mt-4">Tổng 6 số</h4>
              <p>Tổng của 6 số trong một bộ số có thể từ 21 đến 255</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T21 - T67</th>
                        <td>Tổng 6 số từ 21 đến 67</td>
                        <td>63.763</td>
                        <td>0,78%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip
              id="T68 - T114"
              place="top"
              type="light"
              effect="solid"
            >
              <h4 className="mt-4">Tổng 6 số</h4>
              <p>Tổng của 6 số trong một bộ số có thể từ 21 đến 255</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T68 - T114</th>
                        <td>Tổng 6 số có từ 68 đến 114</td>
                        <td>1.737.866</td>
                        <td>21,34%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip
              id="T115 - T161"
              place="top"
              type="light"
              effect="solid"
            >
              <h4 className="mt-4">Tổng 6 số</h4>
              <p>Tổng của 6 số trong một bộ số có thể từ 21 đến 255</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T115 - T161</th>
                        <td>Tổng 6 số có từ 115 đến 161</td>
                        <td>4.541.802</td>
                        <td>55,76%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip
              id="T162 - T208"
              place="top"
              type="light"
              effect="solid"
            >
              <h4 className="mt-4">Tổng 6 số</h4>
              <p>Tổng của 6 số trong một bộ số có thể từ 21 đến 255</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T162 - T208</th>
                        <td>Tổng 6 số có từ 162 đến 208</td>
                        <td>1.737.866</td>
                        <td>21,34%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip
              id="T209 - T255"
              place="top"
              type="light"
              effect="solid"
            >
              <h4 className="mt-4">Tổng 6 số</h4>
              <p>Tổng của 6 số trong một bộ số có thể từ 21 đến 255</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>T209 - T255</th>
                        <td>Tổng 6 số có từ 209 đến 255</td>
                        <td>63.763</td>
                        <td>0,78%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <a className="round-result-char-link" href="/xacsuat#socuoi">
              <span
                className="round-result-stat"
                data-tip
                data-for={roundData.lastNumType}
              >
                {roundData.lastNumType}
              </span>
            </a>
            <ReactTooltip id="Đ6" place="top" type="light" effect="solid">
              <h4 className="mt-4">6 chữ số cuối</h4>
              <p>6 chữ số cuối của 1 bộ số</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Đ6</th>
                        <td>6 số đuôi khác nhau</td>
                        <td>1.708.100</td>
                        <td>20,97%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="Đ5" place="top" type="light" effect="solid">
              <h4 className="mt-4">6 chữ số cuối</h4>
              <p>6 chữ số cuối của 1 bộ số</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Đ5</th>
                        <td>5 số đuôi khác nhau</td>
                        <td>4.048.680</td>
                        <td>49,71%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="Đ4" place="top" type="light" effect="solid">
              <h4 className="mt-4">6 chữ số cuối</h4>
              <p>6 chữ số cuối của 1 bộ số</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Đ4</th>
                        <td>4 số đuôi khác nhau</td>
                        <td>1.850.695</td>
                        <td>22,72%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="Đ3" place="top" type="light" effect="solid">
              <h4 className="mt-4">6 chữ số cuối</h4>
              <p>6 chữ số cuối của 1 bộ số</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Đ3</th>
                        <td>3 số đuôi khác nhau</td>
                        <td>259.600</td>
                        <td>3,19%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="Đ2" place="top" type="light" effect="solid">
              <h4 className="mt-4">6 chữ số cuối</h4>
              <p>6 chữ số cuối của 1 bộ số</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Đ2</th>
                        <td>2 số đuôi khác nhau</td>
                        <td>4.280</td>
                        <td>0,05%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="Đ1" place="top" type="light" effect="solid">
              <h4 className="mt-4">6 chữ số cuối</h4>
              <p>6 chữ số cuối của 1 bộ số</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Đ1</th>
                        <td>6 số đuôi bằng nhau</td>
                        <td>0</td>
                        <td>0,00%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <a className="round-result-char-link" href="/xacsuat#lientiep">
              <span
                className="round-result-stat"
                data-tip
                data-for={roundData.seqNumType}
              >
                {roundData.seqNumType}
              </span>
            </a>
            <ReactTooltip id="L0" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L0</th>
                        <td>Không xuất hiện cặp số liên tiếp</td>
                        <td>3.838.380</td>
                        <td>47,13%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L2" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L2</th>
                        <td>1 cặp số liên tiếp</td>
                        <td>3.290.040</td>
                        <td>40,39%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L2L2" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L2L2</th>
                        <td>2 cặp số liên tiếp</td>
                        <td>548.340</td>
                        <td>6,73%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L2L2L2" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L2L2L2</th>
                        <td>3 cặp số liên tiếp</td>
                        <td>9.880</td>
                        <td>0,12%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L3" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L3</th>
                        <td>3 số liên tiếp nhau</td>
                        <td>365.560</td>
                        <td>4,49%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L3L2" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L3L2</th>
                        <td>3 số liên tiếp và 1 cặp số liên tiếp</td>
                        <td>59.280</td>
                        <td>0,73%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L3L3" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L3L3</th>
                        <td>3 số liên tiếp và 3 số liên tiếp</td>
                        <td>780</td>
                        <td>0,01%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L4" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L4</th>
                        <td>4 số liên tiếp</td>
                        <td>29.640</td>
                        <td>0,36%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L4L2" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L4L2</th>
                        <td>4 số liên tiếp và 1 cặp số liên tiếp</td>
                        <td>1.560</td>
                        <td>0,02%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L5" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L5</th>
                        <td>5 số liên tiếp</td>
                        <td>1.560</td>
                        <td>0,02%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip id="L6" place="top" type="light" effect="solid">
              <h4 className="mt-4">Dãy số liên tiếp</h4>
              <p>Trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ký hiệu</th>
                        <th>Ý nghĩa</th>
                        <th>Bộ số</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>L6</th>
                        <td>6 số liên tiếp</td>
                        <td>40</td>
                        <td>0,00%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ReactTooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(OneRoundResultDelta);
