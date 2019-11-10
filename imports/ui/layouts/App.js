// import packages
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, NavLink } from 'react-router-dom';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import { Roles } from 'meteor/alanning:roles';
import { slide as Menu } from 'react-burger-menu';

// import routes
import Result from '../pages/Result';
import Propability from '../pages/Propability';
import Analyse from '../pages/Analyse';
import AnalyseNum1 from '../pages/AnalyseNum1';
import AnalyseNum2 from '../pages/AnalyseNum2';
import AnalyseNum3 from '../pages/AnalyseNum3';
import AnalyseNum4 from '../pages/AnalyseNum4';
import AnalyseNum5 from '../pages/AnalyseNum5';
import AnalyseNum6 from '../pages/AnalyseNum6';
import Sum from '../pages/Sum';
import Delta from '../pages/Delta';
import NumSkip from '../pages/NumSkip';
import Jackpot from '../pages/Jackpot';
import Group2Num from '../pages/Group2Num';
import Group3Num from '../pages/Group3Num';
import Group4Num from '../pages/Group4Num';

import FindResult from '../pages/FindResult';
import Combine8Num from '../pages/Combine8Num';
import Combine12Num from '../pages/Combine12Num';
import Combine18Num from '../pages/Combine18Num';
import Estimate from '../pages/Estimate';
import Forecast from '../pages/Forecast';

import AddRound from '../pages/admin/AddRound';
import MonitorJobs from '../pages/admin/MonitorJobs';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import EmployeeList from '../pages/EmployeeList';
import EmployeeCreate from '../pages/EmployeeCreate';
import EmployeeUpdate from '../pages/EmployeeUpdate';
import EmployeeAssignment from '../pages/EmployeeAssignment';
import EmployeeResetPassword from '../pages/EmployeeResetPassword';

import ProjectList from '../pages/ProjectList';
import ProjectCreate from '../pages/ProjectCreate';
import ProjectUpdate from '../pages/ProjectUpdate';
import ProjectAssignment from '../pages/ProjectAssignment';

import Report from '../pages/Report';
import NotFound from '../pages/Not-Found';
import RecoverPassword from '../pages/RecoverPassword';
import ResetPassword from '../pages/ResetPassword';

// import Spinner
import PulseLoader from '../components/PulseLoader';

// import hoc to pass additional props to routes
import PropsRoute from '../pages/PropsRoute';

class MenuWrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const sideChanged =
      this.props.children.props.right !== nextProps.children.props.right;

    if (sideChanged) {
      this.setState({ hidden: true });

      setTimeout(() => {
        this.show();
      }, this.props.wait);
    }
  }

  show() {
    this.setState({ hidden: false });
  }

  render() {
    let style;

    if (this.state.hidden) {
      style = { display: 'none' };
    }

    return (
      <div style={style} className={this.props.side}>
        {this.props.children}
      </div>
    );
  }
}

const App = props => (
  <Router>
    <div id="outer-container">
      {/* <PropsRoute component={Navbar} {...props} /> */}
      <MenuWrap wait={20}>
        <Menu pageWrapId="page-wrap" outerContainerId="outer-container" right>
          {Meteor.userId() &&
            (Roles.userIsInRole(Meteor.userId(), 'superadmin') ||
              Roles.userIsInRole(Meteor.userId(), 'admin')) && (
              <>
                <NavLink
                  className="bm-item"
                  key="ad1"
                  to="/themluot"
                  style={{ display: 'block' }}
                >
                  <span>Thêm lượt</span>
                </NavLink>
                <NavLink
                  className="bm-item"
                  key="ad2"
                  to="/tacvu"
                  style={{ display: 'block' }}
                >
                  <span>Tác vụ</span>
                </NavLink>
                <NavLink
                  className="bm-item"
                  key="ad3"
                  to="/doimatkhau"
                  style={{ display: 'block' }}
                >
                  <span>Đổi mật khẩu</span>
                </NavLink>
                <NavLink
                  className="bm-item"
                  key="ad4"
                  to="/ketqua"
                  style={{ display: 'block' }}
                  onClick={() => {
                    NotificationManager.success(
                      'Đăng xuất',
                      'Thành công',
                      3000
                    );
                    setTimeout(Meteor.logout(), 10);
                  }}
                >
                  <span>Đăng xuất</span>
                </NavLink>
                <hr className="bm-item" style={{ display: 'block' }} />
              </>
            )}
          <NavLink key="0" to="/ketqua">
            <span>Kết quả</span>
          </NavLink>
          <hr />
          <NavLink key="1" to="/xacsuat">
            <span>Xác suất</span>
          </NavLink>
          <hr />
          <NavLink key="21" to="/phantich">
            <span>Tần suất</span>
          </NavLink>
          <NavLink key="22" to="/tong">
            <span>Tổng</span>
          </NavLink>
          <NavLink key="23" to="/delta">
            <span>Delta</span>
          </NavLink>
          <NavLink key="24" to="/buocnhay">
            <span>Bước nhảy</span>
          </NavLink>
          <NavLink key="25" to="/jackpot">
            <span>Jackpot</span>
          </NavLink>
          <NavLink key="26" to="/nhom/2so">
            <span>Nhóm</span>
          </NavLink>
          <hr />
          <NavLink key="31" to="/doso">
            <span>Dò số</span>
          </NavLink>
          <NavLink key="32" to="/tohop/8so">
            <span>Tổ hợp</span>
          </NavLink>
          <NavLink key="35" to="/danhgia">
            <span>Đánh giá bộ số</span>
          </NavLink>
          <hr />
          <NavLink key="4" to="/dudoan">
            <span>Dự đoán</span>
          </NavLink>
        </Menu>
      </MenuWrap>
      <main role="main" id="page-wrap">
        <Switch>
          {/* Result */}
          <PropsRoute exact path="/" component={Result} {...props} />
          <PropsRoute exact path="/ketqua" component={Result} {...props} />
          {/* Propability */}
          <PropsRoute
            exact
            path="/xacsuat"
            component={Propability}
            {...props}
          />
          {/* Analyse */}
          <PropsRoute exact path="/phantich" component={Analyse} {...props} />
          <PropsRoute
            exact
            path="/phantich/so1"
            component={AnalyseNum1}
            {...props}
          />
          <PropsRoute
            exact
            path="/phantich/so2"
            component={AnalyseNum2}
            {...props}
          />
          <PropsRoute
            exact
            path="/phantich/so3"
            component={AnalyseNum3}
            {...props}
          />
          <PropsRoute
            exact
            path="/phantich/so4"
            component={AnalyseNum4}
            {...props}
          />
          <PropsRoute
            exact
            path="/phantich/so5"
            component={AnalyseNum5}
            {...props}
          />
          <PropsRoute
            exact
            path="/phantich/so6"
            component={AnalyseNum6}
            {...props}
          />
          <PropsRoute exact path="/tong" component={Sum} {...props} />
          <PropsRoute exact path="/delta" component={Delta} {...props} />
          <PropsRoute exact path="/buocnhay" component={NumSkip} {...props} />
          <PropsRoute exact path="/jackpot" component={Jackpot} {...props} />
          <PropsRoute exact path="/nhom" component={Group2Num} {...props} />
          <PropsRoute exact path="/nhom/2so" component={Group2Num} {...props} />
          <PropsRoute exact path="/nhom/3so" component={Group3Num} {...props} />
          <PropsRoute exact path="/nhom/4so" component={Group4Num} {...props} />
          {/* Tools */}
          <PropsRoute exact path="/doso" component={FindResult} {...props} />
          <PropsRoute exact path="/tohop" component={Combine8Num} {...props} />
          <PropsRoute
            exact
            path="/tohop/8so"
            component={Combine8Num}
            {...props}
          />
          <PropsRoute
            exact
            path="/tohop/12so"
            component={Combine12Num}
            {...props}
          />
          <PropsRoute
            exact
            path="/tohop/18so"
            component={Combine18Num}
            {...props}
          />
          <PropsRoute exact path="/danhgia" component={Estimate} {...props} />

          <PropsRoute exact path="/dudoan" component={Forecast} {...props} />
          {/* Admin */}
          <PropsRoute exact path="/themluot" component={AddRound} {...props} />
          <PropsRoute exact path="/tacvu" component={MonitorJobs} {...props} />
          <PropsRoute path="/login" component={Login} {...props} />
          <PropsRoute exact path="/doimatkhau" component={Profile} {...props} />
          <PropsRoute
            exact
            path="/doimatkhau/:_id"
            component={Profile}
            {...props}
          />
          {/* <PropsRoute
            exact
            path="/employee"
            component={EmployeeList}
            {...props}
          />
          <PropsRoute
            exact
            path="/employee/create"
            component={EmployeeCreate}
            {...props}
          />
          <PropsRoute
            exact
            path="/employee/:_id"
            component={EmployeeUpdate}
            {...props}
          />
          <PropsRoute
            exact
            path="/employee/assignment/:_id"
            component={EmployeeAssignment}
            {...props}
          />
          <PropsRoute
            exact
            path="/employee/resetpassword/:_id"
            component={EmployeeResetPassword}
            {...props}
          />
          <PropsRoute
            exact
            path="/project"
            component={ProjectList}
            {...props}
          />
          <PropsRoute
            exact
            path="/project/create"
            component={ProjectCreate}
            {...props}
          />
          <PropsRoute
            exact
            path="/project/:_id"
            component={ProjectUpdate}
            {...props}
          />
          <PropsRoute
            exact
            path="/project/assignment/:_id"
            component={ProjectAssignment}
            {...props}
          />
          <PropsRoute exact path="/report" component={Report} {...props} />
          <PropsRoute
            path="/recover-password"
            component={RecoverPassword}
            {...props}
          />
          <PropsRoute
            path="/reset-password/:token"
            component={ResetPassword}
            {...props}
          /> */}
          <PropsRoute component={NotFound} {...props} />
        </Switch>
        <NotificationContainer />
      </main>
      {props.loggingIn && <PulseLoader />}
      <footer className="footer">
        <div className="container">
          <span className="text-muted small">
            <b>
VLOT ANALYTICS ©
{new Date().getFullYear()}
            </b>
            <br />
            Không khuyến khích mua vé số | Chơi có trách nhiệm
          </span>
        </div>
      </footer>
    </div>
  </Router>
);

App.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isProjMan: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const userSub = Meteor.subscribe('user');
  const user = Meteor.user();
  const isAdmin =
    Roles.userIsInRole(Meteor.userId(), 'superadmin') ||
    Roles.userIsInRole(Meteor.userId(), 'admin');
  const isProjMan = Roles.userIsInRole(Meteor.userId(), 'projman');
  const userReady = userSub.ready() && !!user;
  const loggingIn = Meteor.loggingIn();
  const loggedIn = !loggingIn && userReady;
  return {
    loggingIn,
    userReady,
    loggedIn,
    isAdmin,
    isProjMan,
  };
})(App);
