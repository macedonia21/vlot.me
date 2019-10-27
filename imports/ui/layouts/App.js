/* eslint-disable import/no-named-default, react/destructuring-assignment */

// import packages
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import { Roles } from 'meteor/alanning:roles';
import { slide as Menu } from 'react-burger-menu';

// import navbar
import Navbar from '../components/Navbar';

// import routes
import Result from '../pages/Result';
import Propability from '../pages/Propability';
import Analyse from '../pages/Analyse';
import AddRound from '../pages/admin/AddRound';
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
import Spinner from '../components/Spinner';

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
      {/* {props.loggingIn && <Spinner />} */}
      <MenuWrap wait={20}>
        <Menu pageWrapId="page-wrap" outerContainerId="outer-container" right>
          <a key="0" href="/">
            <i className="fa fa-fw fa-star-o" />
            <span>Kết quả</span>
          </a>
          <hr />
          <a key="1" href="/xacsuat">
            <i className="fa fa-fw fa-star-o" />
            <span>Xác suất</span>
          </a>
          <hr />
          <a key="21" href="/phantich">
            <i className="fa fa-fw fa-bell-o" />
            <span>Tần suất</span>
          </a>
          <a key="22" href="/tong">
            <i className="fa fa-fw fa-bell-o" />
            <span>Tổng</span>
          </a>
          <a key="23" href="/delta">
            <i className="fa fa-fw fa-bell-o" />
            <span>Delta</span>
          </a>
          <a key="24" href="/buocnhay">
            <i className="fa fa-fw fa-bell-o" />
            <span>Bước nhảy</span>
          </a>
          <a key="25" href="/jackpot">
            <i className="fa fa-fw fa-bell-o" />
            <span>Jackpot</span>
          </a>
          <a key="26" href="/phantichnhom">
            <i className="fa fa-fw fa-bell-o" />
            <span>Nhóm</span>
          </a>
          <hr />
          <a key="31" href="/doso">
            <i className="fa fa-fw fa-envelope-o" />
            <span>Dò số</span>
          </a>
          <a key="32" href="/tohop8">
            <i className="fa fa-fw fa-envelope-o" />
            <span>Tổ hợp 8 số</span>
          </a>
          <a key="33" href="/tohop12">
            <i className="fa fa-fw fa-envelope-o" />
            <span>Tổ hợp 12 số</span>
          </a>
          <a key="34" href="/tohop18">
            <i className="fa fa-fw fa-envelope-o" />
            <span>Tổ hợp 18 số</span>
          </a>
          <a key="35" href="/danhgia">
            <i className="fa fa-fw fa-envelope-o" />
            <span>Đánh giá bộ số</span>
          </a>
          <hr />
          <a key="4" href="/dudoan">
            <i className="fa fa-fw fa-comment-o" />
            <span>Dự đoán</span>
          </a>
        </Menu>
      </MenuWrap>
      <main role="main" id="page-wrap">
        <Switch>
          <PropsRoute exact path="/" component={Result} {...props} />
          <PropsRoute
            exact
            path="/xacsuat"
            component={Propability}
            {...props}
          />
          <PropsRoute path="/phantich" component={Analyse} {...props} />
          <PropsRoute path="/themluot" component={AddRound} {...props} />
          <PropsRoute path="/login" component={Login} {...props} />
          <PropsRoute exact path="/profile" component={Profile} {...props} />
          <PropsRoute
            exact
            path="/profile/:_id"
            component={Profile}
            {...props}
          />
          <PropsRoute
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
          />
          <PropsRoute component={NotFound} {...props} />
        </Switch>
        <NotificationContainer />
      </main>
      <footer className="footer">
        <div className="container">
          <span className="text-muted small">
            <b>VLOT ANALYTICS ©{new Date().getFullYear()}</b>
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
