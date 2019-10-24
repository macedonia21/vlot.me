import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import TagsInput from 'react-tagsinput';
import { _ } from 'underscore';
import { NotificationManager } from 'react-notifications';
import { Roles } from 'meteor/alanning:roles';
import Select from 'react-select';

// import components

// import styles
import './EmployeeUpdate.scss';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-notifications/lib/notifications.css';

class EmployeeUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: {
        srcImage: '',
      },
      loginRoles: {
        admin: false,
        projMan: false,
      },
      isChanged: false,
      isDefaultSet: {
        set: false,
      },
      roles: {
        admin: false,
        projMan: false,
      },
      reactSelect: {
        genderValue: { value: 'M', label: 'Male' },
        genderOptions: [
          {
            value: 'M',
            label: 'Male',
          },
          {
            value: 'F',
            label: 'Female',
          },
        ],
        titleValue: { value: 'C', label: 'Consultant' },
        titleOptions: [
          {
            value: 'BA',
            label: 'Business Analysis',
          },
          {
            value: 'C',
            label: 'Consultant',
          },
          {
            value: 'SC',
            label: 'Senior Consultant',
          },
          {
            value: 'M',
            label: 'Manager',
          },
          {
            value: 'SM',
            label: 'Senior Manager',
          },
          {
            value: 'D',
            label: 'Director',
          },
          {
            value: 'P',
            label: 'Partner',
          },
        ],
        empTypeValue: { value: 'Permanent', label: 'Permanent' },
        empTypeOptions: [
          {
            value: 'Permanent',
            label: 'Permanent',
          },
          {
            value: 'Contractor',
            label: 'Contractor',
          },
        ],
        countryValue: {
          value: 'Vietnam',
          label: 'Vietnam',
          isBaseDisabled: false,
          isEntCodeDisabled: false,
        },
        countryOptions: [
          {
            value: 'Brunei',
            label: 'Brunei',
            isDisabled: true,
            isBaseDisabled: true,
            isEntCodeDisabled: true,
          },
          {
            value: 'Indonesia',
            label: 'Indonesia',
            isDisabled: true,
            isBaseDisabled: true,
            isEntCodeDisabled: true,
          },
          {
            value: 'Myanmar',
            label: 'Myanmar',
            isDisabled: true,
            isBaseDisabled: true,
            isEntCodeDisabled: true,
          },
          {
            value: 'Malaysia',
            label: 'Malaysia',
            isBaseDisabled: true,
            isEntCodeDisabled: false,
          },
          {
            value: 'Philippines',
            label: 'Philippines',
            isDisabled: true,
            isBaseDisabled: true,
            isEntCodeDisabled: true,
          },
          {
            value: 'Singapore',
            label: 'Singapore',
            isBaseDisabled: true,
            isEntCodeDisabled: false,
          },
          {
            value: 'Thailand',
            label: 'Thailand',
            isDisabled: true,
            isBaseDisabled: true,
            isEntCodeDisabled: true,
          },
          {
            value: 'Vietnam',
            label: 'Vietnam',
            isBaseDisabled: false,
            isEntCodeDisabled: false,
          },
        ],
        baseSelectDisabled: false,
        baseValue: {
          value: 'HCM',
          label: 'Ho Chi Minh',
          country: 'Vietnam',
        },
        baseAllOptions: [
          {
            value: 'BS',
            label: 'Brunei',
            country: 'Brunei',
          },
          {
            value: 'JK',
            label: 'Indonesia',
            country: 'Indonesia',
          },
          {
            value: 'YG',
            label: 'Myanmar',
            country: 'Myanmar',
          },
          {
            value: 'KL',
            label: 'Malaysia',
            country: 'Malaysia',
          },
          {
            value: 'MN',
            label: 'Philippines',
            country: 'Philippines',
          },
          {
            value: 'SG',
            label: 'Singapore',
            country: 'Singapore',
          },
          {
            value: 'BK',
            label: 'Thailand',
            country: 'Thailand',
          },
          {
            value: 'HCM',
            label: 'Ho Chi Minh',
            country: 'Vietnam',
          },
          {
            value: 'HN',
            label: 'Ha Noi',
            country: 'Vietnam',
          },
        ],
        baseOptions: [
          {
            value: 'HCM',
            label: 'Ho Chi Minh',
            country: 'Vietnam',
          },
          {
            value: 'HN',
            label: 'Ha Noi',
            country: 'Vietnam',
          },
        ],
        entCodeSelectDisabled: false,
        entCodeValue: {
          value: 'VN1C',
          label: '(VN1C) Deloitte Consulting Vietnam Co Ltd',
          country: 'Vietnam',
        },
        entCodeAllOptions: [
          {
            value: 'ID1C',
            label: '(ID1C) PT Deloitte Consulting',
            country: 'Indonesia',
          },
          {
            value: 'ID2C',
            label: '(ID2C) PT DC Solutions',
            country: 'Indonesia',
          },
          {
            value: 'MM1C',
            label: '(MM1C) Deloitte Consulting (Myanmar Limited)',
            country: 'Myanmar',
          },
          {
            value: 'MM2C',
            label: '(MM2C) Deloitte Consulting (Myanmar Limited)',
            country: 'Myanmar',
          },
          {
            value: 'MY1C',
            label: '(MY1C) Deloitte Consulting (SEA) Sdn Bhd',
            country: 'Malaysia',
          },
          {
            value: 'MY2C',
            label: '(MY2C) Deloitte Consulting Malaysia Sdn Bhd',
            country: 'Malaysia',
          },
          {
            value: 'MY3C',
            label: '(MY3C) DC Technology Solutions',
            country: 'Malaysia',
          },
          {
            value: 'PH1C',
            label: '(PH1C) Deloitte & Touche Consulting Grp / ICS Pte Ltd ',
            country: 'Philippines',
          },
          {
            value: 'SG1C',
            label: '(SG1C) Deloitte Consulting Pte Ltd',
            country: 'Singapore',
          },
          {
            value: 'BN1C',
            label: '(BN1C) Deloitte Consulting Pte Ltd',
            country: 'Brunei',
          },
          {
            value: 'BN2C',
            label: '(BN2C) Deloitte Consulting Pte Ltd',
            country: 'Brunei',
          },
          {
            value: 'SG2C',
            label: '(SG2C) Deloitte Consulting / ICS Pte Ltd',
            country: 'Singapore',
          },
          {
            value: 'SG9C',
            label: '(SG9C) Deloitte Consulting (SEA) Holdings Pte Ltd',
            country: 'Singapore',
          },
          {
            value: 'TH1C',
            label: '(TH1C) Deloitte Consulting Limited',
            country: 'Thailand',
          },
          {
            value: 'TH2C',
            label: '(TH2C) Deloitte Touche Tohmatsu Jaiyos Advisory Co., Ltd. ',
            country: 'Thailand',
          },
          {
            value: 'TH9C',
            label: '(TH9C) Deloitte Holding Limited',
            country: 'Thailand',
          },
          {
            value: 'VN1C',
            label: '(VN1C) Deloitte Consulting Vietnam Co Ltd',
            country: 'Vietnam',
          },
          {
            value: 'VN2C',
            label: '(VN2C) Branch Deloitte Consulting Vietnam Co Ltd in Hanoi',
            country: 'Vietnam',
          },
        ],
        entCodeOptions: [
          {
            value: 'VN1C',
            label: '(VN1C) Deloitte Consulting Vietnam Co Ltd',
            country: 'Vietnam',
          },
          {
            value: 'VN2C',
            label: '(VN2C) Branch Deloitte Consulting Vietnam Co Ltd in Hanoi',
            country: 'Vietnam',
          },
        ],
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRoleAdminClick = this.handleRoleAdminClick.bind(this);
    this.handleRoleProjManClick = this.handleRoleProjManClick.bind(this);

    this.handleAvatarUpload = this.handleAvatarUpload.bind(this);
  }

  componentWillMount() {
    if (!Meteor.userId()) {
      return this.props.history.push('/login');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!Meteor.userId()) {
      nextProps.history.push('/login');
      return false;
    }
    return true;
  }

  handleAvatarUpload() {
    const { user } = this.props;
    const metaContext = { avatarId: user._id };
    const uploader = new Slingshot.Upload('myImageUploads', metaContext);
    uploader.send(
      document.getElementById('customFile').files[0],
      function(error, downloadUrl) {
        // you can use refs if you like
        if (error) {
          // Log service detailed response
          NotificationManager.error(
            `Cannot upload: ${uploader.xhr.response}`,
            'Error',
            3000
          );
        } else {
          // you will need this in the event the user hit the update button because it will remove the avatar url
          this.setState({ avatar: { srcImage: downloadUrl }, isChanged: true });
          user.profile.avatar = downloadUrl;
          NotificationManager.success(
            'Employee image is uploaded',
            'Success',
            3000
          );
        }
      }.bind(this)
    );
  }

  handleRoleAdminClick() {
    this.setState({
      isChanged: true,
      roles: {
        ...this.state.roles,
        admin: !this.state.roles.admin,
      },
    });
  }

  handleRoleProjManClick() {
    this.setState({
      isChanged: true,
      roles: {
        ...this.state.roles,
        projMan: !this.state.roles.projMan,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { user } = this.props;
    const { roles } = this.state;
    Meteor.call(
      'employee.update',
      user._id,
      user.profile,
      user.disabled,
      roles,
      (err, res) => {
        if (err) {
          NotificationManager.error(
            `Cannot update: ${err.message}`,
            'Error',
            3000
          );
        } else {
          NotificationManager.success(
            'Employee profile is updated',
            'Success',
            3000
          );
          return this.props.history.push('/employee');
        }
      }
    );
  }

  render() {
    const { loggedIn, usersReady, user } = this.props;
    const { loginRoles, roles, isDefaultSet, reactSelect, avatar } = this.state;

    if (Meteor.userId()) {
      if (
        Roles.userIsInRole(Meteor.userId(), 'superadmin') ||
        Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        loginRoles.admin = true;
      }
      if (Roles.userIsInRole(Meteor.userId(), 'projman')) {
        loginRoles.projMan = true;
      }
    }

    if (user && !isDefaultSet.set) {
      isDefaultSet.set = true;
      if (Roles.userIsInRole(user._id, 'admin')) {
        roles.admin = true;
      }
      if (Roles.userIsInRole(user._id, 'projman')) {
        roles.projMan = true;
      }

      avatar.srcImage = user.profile.avatar;
    }

    const reactSelectStyle = {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: state.isDisabled ? '#e9ecef' : '#fff',
        borderColor: state.isFocused ? '#80bdff' : '#ced4da',
        outline: state.isFocused ? 0 : null,
        boxShadow: state.isFocused
          ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
          : '',
      }),
    };
    const defaultGenderOption = user
      ? _.findWhere(reactSelect.genderOptions, { value: user.profile.gender })
      : null;
    reactSelect.genderValue = defaultGenderOption;
    const defaultTitleOption = user
      ? _.findWhere(reactSelect.titleOptions, { value: user.profile.posTitle })
      : null;
    reactSelect.titleValue = defaultTitleOption;
    const defaultEmpTypeOption = user
      ? _.findWhere(reactSelect.empTypeOptions, { value: user.profile.empType })
      : null;
    reactSelect.empTypeValue = defaultEmpTypeOption;
    const defaultCountryOption = user
      ? _.findWhere(reactSelect.countryOptions, { value: user.profile.country })
      : null;
    reactSelect.countryValue = defaultCountryOption;
    const defaultBaseOption = user
      ? _.findWhere(reactSelect.baseAllOptions, {
          value: user.profile.base,
        })
      : null;
    reactSelect.baseValue = defaultBaseOption;
    reactSelect.baseOptions = user
      ? _.where(reactSelect.baseAllOptions, {
          country: user.profile.country,
        })
      : null;
    reactSelect.baseSelectDisabled = user
      ? reactSelect.countryValue.isBaseDisabled
      : false;
    const defaultEntCodeOption = user
      ? _.findWhere(reactSelect.entCodeAllOptions, {
          value: user.profile.entCode,
        })
      : null;
    reactSelect.entCodeValue = defaultEntCodeOption;
    reactSelect.entCodeOptions = user
      ? _.where(reactSelect.entCodeAllOptions, {
          country: user.profile.country,
        })
      : null;
    reactSelect.entCodeSelectDisabled = user
      ? reactSelect.countryValue.isEntCodeDisabled
      : false;

    if (!loggedIn) {
      return null;
    }

    return (
      <section className="create-employee-page">
        <div className="card mx-auto" style={{ maxWidth: '80%' }}>
          <div className="card-header">
            <div className="card-body">
              <h1 className="card-title text-center">Employee Profile</h1>
              {!loginRoles.admin && !loginRoles.projMan && (
                <h4 className="text-center text-danger">
                  You are not authorized to view Employee
                </h4>
              )}
              {usersReady && (loginRoles.admin || loginRoles.projMan) && (
                <form onSubmit={this.handleSubmit}>
                  <div className="row">
                    {/* <!-- First Col --> */}
                    <div className="col-md-4">
                      {/* <!-- Email --> */}
                      <div className="form-group">
                        <label htmlFor="email">E-Mail Address</label>
                        <input
                          id="email"
                          type="email"
                          className="form-control"
                          name="email"
                          value={user.profile.email}
                          required
                          disabled
                        />
                      </div>

                      {/* <!-- Password --> */}
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          id="password"
                          type="password"
                          className="form-control"
                          name="password"
                          value=""
                          required
                          disabled
                        />
                      </div>

                      {/* <!-- First Name --> */}
                      <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input
                          id="firstname"
                          type="text"
                          className="form-control"
                          name="firstname"
                          value={user.profile.firstName}
                          onChange={e => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.firstName = e.target.value;
                          }}
                          required
                          disabled={!loginRoles.admin}
                        />
                      </div>

                      {/* <!-- Last Name --> */}
                      <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input
                          id="lastname"
                          type="text"
                          className="form-control"
                          name="lastname"
                          value={user.profile.lastName}
                          onChange={e => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.lastName = e.target.value;
                          }}
                          required
                          disabled={!loginRoles.admin}
                        />
                      </div>

                      {/* <!-- VN Name --> */}
                      <div className="form-group">
                        <label htmlFor="vnname">Vietnamese Name</label>
                        <input
                          id="vnname"
                          type="text"
                          className="form-control"
                          name="vnname"
                          value={user.profile.vnName}
                          onChange={e => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.vnName = e.target.value;
                          }}
                          required
                          disabled={!loginRoles.admin}
                        />
                      </div>

                      {/* <!-- Gender --> */}
                      <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <Select
                          defaultValue={defaultGenderOption}
                          value={reactSelect.genderValue}
                          options={reactSelect.genderOptions}
                          placeholder="Select Gender"
                          onChange={selectedOption => {
                            this.setState({
                              isChanged: true,
                              reactSelect: {
                                ...this.state.reactSelect,
                                genderValue: selectedOption,
                              },
                            });
                            user.profile.gender = selectedOption.value;
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                          isDisabled={!loginRoles.admin}
                        />
                      </div>
                    </div>

                    {/* <!-- Second Col --> */}
                    <div className="col-md-4">
                      {/* <!-- Join Date --> */}
                      <div className="form-group">
                        <label htmlFor="joindate">Join Date</label>
                        <DatePicker
                          className="form-control"
                          selected={user.profile.joinDate}
                          onChange={date => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.joinDate = date;
                          }}
                          dateFormat="MMM dd, yyyy"
                          required
                          disabled={!loginRoles.admin}
                        />
                      </div>

                      {/* <!-- Talents --> */}
                      <div className="form-group">
                        <label htmlFor="talents">Capabilities</label>
                        <TagsInput
                          id="talents"
                          className={
                            loginRoles.admin
                              ? 'form-control'
                              : 'form-control form-control-disabled'
                          }
                          value={user.profile.talents}
                          maxTags={4}
                          onChange={tags => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.talents = tags;
                          }}
                          disabled={!loginRoles.admin}
                        />
                      </div>

                      {/* <!-- Position Title --> */}
                      <div className="form-group">
                        <label htmlFor="postitle">Position Title</label>
                        <Select
                          defaultValue={defaultTitleOption}
                          value={reactSelect.titleValue}
                          options={reactSelect.titleOptions}
                          placeholder="Select Position Title"
                          onChange={selectedOption => {
                            this.setState({
                              isChanged: true,
                              reactSelect: {
                                ...this.state.reactSelect,
                                titleValue: selectedOption,
                              },
                            });
                            user.profile.posTitle = selectedOption.value;
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                          isDisabled={!loginRoles.admin}
                        />
                      </div>

                      {/* <!-- Job Level --> */}
                      <div className="form-group">
                        <label htmlFor="joblevel">Job Level</label>
                        <input
                          id="joblevel"
                          type="text"
                          className="form-control"
                          name="joblevel"
                          value={loginRoles.admin ? user.profile.jobLevel : ''}
                          onChange={e => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.jobLevel = e.target.value;
                          }}
                          required
                          disabled={!loginRoles.admin}
                        />
                      </div>

                      {/* <!-- Base --> */}
                      <div className="form-group">
                        <label htmlFor="base">Base</label>
                        <Select
                          defaultValue={defaultBaseOption}
                          value={reactSelect.baseValue}
                          options={reactSelect.baseOptions}
                          placeholder="Select Base"
                          onChange={selectedOption => {
                            this.setState({
                              isChanged: true,
                              reactSelect: {
                                ...this.state.reactSelect,
                                baseValue: selectedOption,
                              },
                            });
                            user.profile.base = selectedOption.value;
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                          valueKey="value"
                          labelKey="label"
                          isDisabled={
                            reactSelect.baseSelectDisabled || !loginRoles.admin
                          }
                        />
                      </div>

                      {/* <!-- Entity Code --> */}
                      <div className="form-group">
                        <label htmlFor="entcode">Entity Code</label>
                        <Select
                          defaultValue={defaultEntCodeOption}
                          value={reactSelect.entCodeValue}
                          options={reactSelect.entCodeOptions}
                          placeholder="Select Entity Code"
                          onChange={selectedOption => {
                            this.setState({
                              isChanged: true,
                              reactSelect: {
                                ...this.state.reactSelect,
                                entCodeValue: selectedOption,
                              },
                            });
                            user.profile.entCode = selectedOption.value;
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                          valueKey="value"
                          labelKey="label"
                          isDisabled={
                            reactSelect.entCodeSelectDisabled ||
                            !loginRoles.admin
                          }
                        />
                      </div>

                      {/* <!-- Roles --> */}
                      {loginRoles.admin && (
                        <div className="form-group">
                          <div
                            className="btn-group d-flex"
                            role="group"
                            aria-label="Roles"
                          >
                            <button
                              type="button"
                              className={
                                roles.admin
                                  ? 'btn btn-primary w-100'
                                  : 'btn btn-secondary w-100'
                              }
                              onClick={
                                loginRoles.admin
                                  ? this.handleRoleAdminClick
                                  : null
                              }
                              disabled={!loginRoles.admin}
                            >
                              {roles.admin ? 'Admin' : 'Not Admin'}
                            </button>
                            <button
                              type="button"
                              className={
                                roles.projMan
                                  ? 'btn btn-primary w-100'
                                  : 'btn btn-secondary w-100'
                              }
                              onClick={
                                loginRoles.admin
                                  ? this.handleRoleProjManClick
                                  : null
                              }
                              disabled={!loginRoles.admin}
                            >
                              {roles.projMan
                                ? 'Project Manager'
                                : 'Not Proj. Manager'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* <!-- Third Col --> */}
                    <div className="col-md-4">
                      {/* <!-- Country --> */}
                      <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <Select
                          defaultValue={defaultCountryOption}
                          value={reactSelect.countryValue}
                          options={reactSelect.countryOptions}
                          placeholder="Select Country"
                          onChange={selectedOption => {
                            this.setState({
                              isChanged: true,
                              reactSelect: {
                                ...this.state.reactSelect,
                                countryValue: selectedOption,
                                baseValue: _.findWhere(
                                  reactSelect.baseAllOptions,
                                  {
                                    country: selectedOption.value,
                                  }
                                ),
                                entCodeValue: _.findWhere(
                                  reactSelect.entCodeAllOptions,
                                  {
                                    country: selectedOption.value,
                                  }
                                ),
                              },
                            });
                            user.profile.country = selectedOption.value;
                            user.profile.base = _.findWhere(
                              reactSelect.baseAllOptions,
                              {
                                country: selectedOption.value,
                              }
                            ).value;
                            user.profile.entCode = _.findWhere(
                              reactSelect.entCodeAllOptions,
                              {
                                country: selectedOption.value,
                              }
                            ).value;
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                          isDisabled={!loginRoles.admin}
                        />
                      </div>

                      {/* <!-- Employment Type --> */}
                      <div className="form-group">
                        <label htmlFor="emptype">Employment Type</label>
                        <Select
                          defaultValue={
                            loginRoles.admin ? defaultEmpTypeOption : null
                          }
                          value={
                            loginRoles.admin ? reactSelect.empTypeValue : null
                          }
                          options={reactSelect.empTypeOptions}
                          placeholder="Select Employment Type"
                          onChange={selectedOption => {
                            this.setState({
                              isChanged: true,
                              reactSelect: {
                                ...this.state.reactSelect,
                                empTypeValue: selectedOption,
                              },
                            });
                            user.profile.empType = selectedOption.value;
                            if (user.profile.empType === 'Permanent') {
                              user.profile.hPW = 40;
                            }
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                          isDisabled={!loginRoles.admin}
                        />
                      </div>

                      {/* <!-- Hours Per Week --> */}
                      <div className="form-group">
                        <label htmlFor="hpw">Hours Per Week</label>
                        <input
                          id="hpw"
                          type="number"
                          max={40}
                          min={0}
                          className="form-control"
                          name="hpw"
                          value={loginRoles.admin ? user.profile.hPW || 0 : ''}
                          onChange={e => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.hPW = parseInt(e.target.value);
                          }}
                          required
                          disabled={
                            user.profile.empType === 'Permanent' ||
                            !loginRoles.admin
                          }
                        />
                      </div>

                      {/* <!-- Cost Center --> */}
                      <div className="form-group">
                        <label htmlFor="costcenter">Cost Center</label>
                        <input
                          id="costcenter"
                          type="text"
                          className="form-control"
                          name="costcenter"
                          value={user.profile.costCenter}
                          onChange={e => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.costCenter = e.target.value;
                          }}
                          required
                          disabled
                        />
                      </div>

                      {/* <!-- Portfolios --> */}
                      <div className="form-group">
                        <label htmlFor="portfolios">Portfolios</label>
                        <input
                          id="portfolios"
                          type="text"
                          className="form-control"
                          name="portfolios"
                          value={user.profile.portfolios}
                          onChange={e => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.portfolios = e.target.value;
                          }}
                          required
                          disabled
                        />
                      </div>

                      {/* <!-- Offering --> */}
                      <div className="form-group">
                        <label htmlFor="offering">Offering</label>
                        <input
                          id="offering"
                          type="text"
                          className="form-control"
                          name="offering"
                          value={user.profile.offering}
                          onChange={e => {
                            this.setState({
                              isChanged: true,
                            });
                            user.profile.offering = e.target.value;
                          }}
                          required
                          disabled
                        />
                      </div>

                      {/* <!-- Active --> */}
                      <div className="form-group">
                        <button
                          type="button"
                          className={
                            user.disabled
                              ? 'btn btn-block btn-secondary'
                              : 'btn btn-block btn-primary'
                          }
                          onClick={() => {
                            this.setState({
                              isChanged: true,
                            });
                            user.disabled = !user.disabled;
                          }}
                          disabled={!loginRoles.admin}
                        >
                          {user.disabled ? 'Inactive' : 'Active'}
                        </button>
                      </div>
                    </div>
                  </div>
                  {loginRoles.admin && (
                    <>
                      <hr />
                      <h1 className="card-title text-center">Upload Avatar</h1>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="email">Employee Image</label>
                            <div className="custom-file">
                              <label
                                className="custom-file-label"
                                htmlFor="customFile"
                              >
                                Choose file
                              </label>
                              <input
                                className="form-control"
                                type="file"
                                id="customFile"
                                onChange={this.handleAvatarUpload}
                              />
                            </div>
                            <p className="help-block">
                              Image max restriction: 1MB, 512 x 512. Cropped:
                              120 x 120
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div
                            className="text-center"
                            style={{ height: '124px', marginBottom: '1rem' }}
                          >
                            <div
                              id="carouselExampleControls"
                              className="carousel slide"
                              data-ride="carousel"
                            >
                              <div className="carousel-inner">
                                <div className="carousel-item active">
                                  <div className="inline-avatar-block ml-1 mr-1">
                                    <span className="badge badge-pill badge-primary emp-img-badge">
                                      Assigning Project
                                    </span>

                                    <div className="img-wrap primary-border">
                                      <img
                                        className="img-fluid"
                                        src={
                                          avatar.srcImage ||
                                          '/img/avatar_placeholder.png'
                                        }
                                        alt="No image"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="carousel-item">
                                  <div className="inline-avatar-block ml-1 mr-1">
                                    <span className="badge badge-pill badge-danger emp-img-badge">
                                      Available
                                    </span>

                                    <div className="img-wrap danger-border">
                                      <img
                                        className="img-fluid"
                                        src={
                                          avatar.srcImage ||
                                          '/img/avatar_placeholder.png'
                                        }
                                        alt="No image"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="carousel-item">
                                  <div className="inline-avatar-block ml-1 mr-1">
                                    <span className="badge badge-pill badge-secondary emp-img-badge">
                                      Inactive
                                    </span>

                                    <div className="img-wrap secondary-border">
                                      <img
                                        className="img-fluid img-fluid-disabled"
                                        src={
                                          avatar.srcImage ||
                                          '/img/avatar_placeholder.png'
                                        }
                                        alt="No image"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <a
                                className="carousel-control-prev"
                                href="#carouselExampleControls"
                                role="button"
                                data-slide="prev"
                              >
                                <span
                                  className="carousel-control-prev-icon fa fa-angle-left"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Previous</span>
                              </a>
                              <a
                                className="carousel-control-next"
                                href="#carouselExampleControls"
                                role="button"
                                data-slide="next"
                              >
                                <span
                                  className="carousel-control-next-icon fa fa-angle-right"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Next</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group no-margin">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block mb-2"
                          disabled={!this.state.isChanged}
                        >
                          Update
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

EmployeeUpdate.defaultProps = {
  // users: null, remote example (if using ddp)
  user: null,
};

EmployeeUpdate.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  usersReady: PropTypes.bool.isRequired,
  user: PropTypes.objectOf(Meteor.user),
};

export default withTracker(props => {
  const usersSub = Meteor.subscribe('users.all'); // publication needs to be set on remote server
  const users = Meteor.users.find().fetch();
  const user = _.findWhere(users, { _id: props.match.params._id });
  const usersReady = usersSub.ready() && !!users;

  return {
    usersReady,
    user,
  };
})(EmployeeUpdate);
