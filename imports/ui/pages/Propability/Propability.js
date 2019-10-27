import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './Propability.scss';

class Propability extends React.Component {
  componentWillMount() {
    if (Meteor.userId()) {
      return this.props.history.push('/report');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (Meteor.userId()) {
      nextProps.history.push('/report');
      return false;
    }
    return true;
  }

  render() {
    if (this.props.loggedIn) {
      return null;
    }
    return (
      <div className="container">
        <h1>Xác suất</h1>
        <div className="text-left social-actions">
          <div
            className="fb-like"
            data-href="http://vlot.me/xacxuat"
            data-layout="standard"
            data-action="like"
            data-size="large"
            data-show-faces="false"
            data-share="true"
          />
        </div>
        <h3>Nắm rõ xác suất chiến thắng</h3>
        <p>
          Một bộ số Vietlott là một bộ 6 số trong tập hợp các số từ 01 đến 45
          hay còn gọi là 6/45. Có tất cả <b>8.145.060</b>
          bộ số có thể phát sinh hay xác suất để thắng Jackpot (Giải đặc biệt)
          là&nbsp;
          <b>1 phần 8.145.060</b>
        </p>
        <h3>Xác suất thắng giải</h3>
        <p>Các mức giải thưởng và xác suất thắng giải</p>
        <div className="row">
          <div className="col-sm-12">
            <table className="table">
              <thead>
                <tr>
                  <th>Giải</th>
                  <th>Giá trị</th>
                  <th>Xác suất</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Jackpot</th>
                  <td>12.000.000.000 cộng dồn</td>
                  <td>1 / 8.145.060</td>
                </tr>
                <tr>
                  <th>Giải Nhất</th>
                  <td>10.000.000</td>
                  <td>1 / 34.808</td>
                </tr>
                <tr>
                  <th>Giải Nhì</th>
                  <td>300.000</td>
                  <td>1 / 733</td>
                </tr>
                <tr>
                  <th>Giải Ba</th>
                  <td>30.000</td>
                  <td>1 / 45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>
          <div className="anchor-offset" id="chanle" />
          Tỉ lệ Chẵn Lẻ
        </h3>
        <p>
          Tập hợp các số từ 01 đến 45 gồm có 22 số Chẵn và 23 số Lẻ. Các trường
          hợp có thể phát sinh
        </p>
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
                <tr>
                  <th>C1 / 5L</th>
                  <td>1 số Chẵn, 5 số Lẻ</td>
                  <td>740.278</td>
                  <td>9,09%</td>
                </tr>
                <tr className="active">
                  <th>C2 / 4L</th>
                  <td>2 số Chẵn, 4 số Lẻ</td>
                  <td>2.045.505</td>
                  <td>25,11%</td>
                </tr>
                <tr className="active">
                  <th>C3 / 3L</th>
                  <td>3 số Chẵn, 3 số Lẻ</td>
                  <td>2.727.340</td>
                  <td>33,48%</td>
                </tr>
                <tr className="active">
                  <th>C4 / 2L</th>
                  <td>4 số Chẵn, 2 số Lẻ</td>
                  <td>1.850.695</td>
                  <td>22,72%</td>
                </tr>
                <tr>
                  <th>C5 / 1L</th>
                  <td>5 số Chẵn, 1 số Lẻ</td>
                  <td>605.682</td>
                  <td>7,44%</td>
                </tr>
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
        <h3>
          <div className="anchor-offset" id="taixiu" />
          Tỉ lệ Tài Xỉu
        </h3>
        <p>
          Tập hợp các số từ 01 đến 45 gồm có 22 số Xỉu và 23 số Tài. Các trường
          hợp có thể phát sinh
        </p>
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
                <tr>
                  <th>T1 / 5X</th>
                  <td>1 số Tài, 5 số Xỉu</td>
                  <td>605.682</td>
                  <td>7,44%</td>
                </tr>
                <tr className="active">
                  <th>T2 / 4X</th>
                  <td>2 số Tài, 4 số Xỉu</td>
                  <td>1.850.695</td>
                  <td>22,72%</td>
                </tr>
                <tr className="active">
                  <th>T3 / 3X</th>
                  <td>3 số Tài, 3 số Xỉu</td>
                  <td>2.727.340</td>
                  <td>33,48%</td>
                </tr>
                <tr className="active">
                  <th>T4 / 2X</th>
                  <td>4 số Tài, 2 số Xỉu</td>
                  <td>2.045.505</td>
                  <td>25,11%</td>
                </tr>
                <tr>
                  <th>T5 / 1X</th>
                  <td>5 số Tài, 1 số Xỉu</td>
                  <td>740.278</td>
                  <td>9,09%</td>
                </tr>
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
        <h3>
          <div className="anchor-offset" id="tong" />
          Tổng 6 số
        </h3>
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
                <tr className="active">
                  <th>T68 - T114</th>
                  <td>Tổng 6 số có từ 68 đến 114</td>
                  <td>1.737.866</td>
                  <td>21,34%</td>
                </tr>
                <tr className="active">
                  <th>T115 - T161</th>
                  <td>Tổng 6 số có từ 115 đến 161</td>
                  <td>4.541.802</td>
                  <td>55,76%</td>
                </tr>
                <tr className="active">
                  <th>T162 - T208</th>
                  <td>Tổng 6 số có từ 162 đến 208</td>
                  <td>1.737.866</td>
                  <td>21,34%</td>
                </tr>
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
        <h3>
          <div className="anchor-offset" id="socuoi" />6 chữ số cuối
        </h3>
        <p>Nếu xét 6 chữ số cuối của 1 bộ số thì có các trường hợp</p>
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
                <tr className="active">
                  <th>Đ6</th>
                  <td>6 số đuôi khác nhau</td>
                  <td>1.708.100</td>
                  <td>20,97%</td>
                </tr>
                <tr className="active">
                  <th>Đ5</th>
                  <td>5 số đuôi khác nhau</td>
                  <td>4.048.680</td>
                  <td>49,71%</td>
                </tr>
                <tr className="active">
                  <th>Đ4</th>
                  <td>4 số đuôi khác nhau</td>
                  <td>1.850.695</td>
                  <td>22,72%</td>
                </tr>
                <tr>
                  <th>Đ3</th>
                  <td>3 số đuôi khác nhau</td>
                  <td>259.600</td>
                  <td>3,19%</td>
                </tr>
                <tr>
                  <th>Đ2</th>
                  <td>2 số đuôi khác nhau</td>
                  <td>4.280</td>
                  <td>0,05%</td>
                </tr>
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
        <h3>
          <div className="anchor-offset" id="lientiep" />
          Dãy số liên tiếp
        </h3>
        <p>Xét các trường hợp xuất hiện 2 hoặc nhiều hơn các số liên tiếp</p>
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
                <tr className="active">
                  <th>L0</th>
                  <td>Không xuất hiện cặp số liên tiếp</td>
                  <td>3.838.380</td>
                  <td>47,13%</td>
                </tr>
                <tr className="active">
                  <th>L2</th>
                  <td>1 cặp số liên tiếp</td>
                  <td>3.290.040</td>
                  <td>40,39%</td>
                </tr>
                <tr>
                  <th>L2L2</th>
                  <td>2 cặp số liên tiếp</td>
                  <td>548.340</td>
                  <td>6,73%</td>
                </tr>
                <tr>
                  <th>L2L2L2</th>
                  <td>3 cặp số liên tiếp</td>
                  <td>9.880</td>
                  <td>0,12%</td>
                </tr>
                <tr>
                  <th>L3</th>
                  <td>3 số liên tiếp nhau</td>
                  <td>365.560</td>
                  <td>4,49%</td>
                </tr>
                <tr>
                  <th>L3L2</th>
                  <td>3 số liên tiếp và 1 cặp số liên tiếp</td>
                  <td>59.280</td>
                  <td>0,73%</td>
                </tr>
                <tr>
                  <th>L3L3</th>
                  <td>3 số liên tiếp và 3 số liên tiếp</td>
                  <td>780</td>
                  <td>0,01%</td>
                </tr>
                <tr>
                  <th>L4</th>
                  <td>4 số liên tiếp</td>
                  <td>29.640</td>
                  <td>0,36%</td>
                </tr>
                <tr>
                  <th>L4L2</th>
                  <td>4 số liên tiếp và 1 cặp số liên tiếp</td>
                  <td>1.560</td>
                  <td>0,02%</td>
                </tr>
                <tr>
                  <th>L5</th>
                  <td>5 số liên tiếp</td>
                  <td>1.560</td>
                  <td>0,02%</td>
                </tr>
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
      </div>
    );
  }
}

Propability.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Propability;
