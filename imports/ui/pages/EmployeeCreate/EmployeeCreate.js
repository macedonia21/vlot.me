import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import TagsInput from 'react-tagsinput';
import { NotificationManager } from 'react-notifications';
import { Roles } from 'meteor/alanning:roles';
import Select from 'react-select';

// import components

// import styles
import './EmployeeCreate.scss';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-notifications/lib/notifications.css';

class CreateEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginRoles: {
        admin: false,
        projMan: false,
      },
      isPasswordShown: false,
      email: '',
      password: '',
      profile: {
        firstName: '',
        lastName: '',
        vnName: '',
        entCode: 'VN1C',
        country: 'Vietnam',
        joinDate: new Date(),
        base: 'HCM',
        empType: 'Permanent',
        indicator: '',
        indAlignment: '',
        costCenter: 'TI:SAP Solutions',
        portfolios: 'Enterprise Technology and Performance',
        offering: 'SAP',
        posTitle: 'C',
        jobLevel: 'C',
        gender: 'M',
        talents: [],
        hPW: 40,
        _counsellorId: '',
      },
      disabled: false,
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
    this.handleActiveClick = this.handleActiveClick.bind(this);
    this.handleRoleAdminClick = this.handleRoleAdminClick.bind(this);
    this.handleRoleProjManClick = this.handleRoleProjManClick.bind(this);
    this.handlePasswordShow = this.handlePasswordShow.bind(this);
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

  handleActiveClick() {
    this.setState({
      disabled: !this.state.disabled,
    });
  }

  handleRoleAdminClick() {
    this.setState({
      roles: {
        ...this.state.roles,
        admin: !this.state.roles.admin,
      },
    });
  }

  handleRoleProjManClick() {
    this.setState({
      roles: {
        ...this.state.roles,
        projMan: !this.state.roles.projMan,
      },
    });
  }

  handlePasswordShow() {
    this.setState({
      isPasswordShown: !this.state.isPasswordShown,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password, profile, disabled, roles } = this.state;
    Meteor.call(
      'employee.create',
      email,
      password,
      profile,
      disabled,
      roles,
      (err, res) => {
        if (err) {
          NotificationManager.error(
            `Cannot create: ${err.message}`,
            'Error',
            3000
          );
        } else {
          NotificationManager.success(
            'New employee is created',
            'Success',
            3000
          );
          return this.props.history.push('/employee');
        }
      }
    );
  }

  render() {
    const { loggedIn } = this.props;
    const {
      isPasswordShown,
      email,
      password,
      profile,
      disabled,
      loginRoles,
      roles,
      reactSelect,
    } = this.state;

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

    if (!loggedIn) {
      return null;
    }

    return (
      <section className="create-employee-page">
        <div className="card mx-auto" style={{ maxWidth: '80%' }}>
          <div className="card-header">
            <div className="card-body">
              <h1 className="card-title text-center">Create Employee</h1>
              {!loginRoles.admin && (
                <h4 className="text-center text-danger">
                  You are not authorized to create Employee
                </h4>
              )}
              {loginRoles.admin && (
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
                          value={email}
                          onChange={e =>
                            this.setState({
                              email: e.target.value.toLowerCase(),
                            })
                          }
                          required
                        />
                      </div>

                      {/* <!-- Password --> */}
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-group">
                          <input
                            id="password"
                            type={isPasswordShown ? 'text' : 'password'}
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={e =>
                              this.setState({ password: e.target.value })
                            }
                            required
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              id="button-addon1"
                              onClick={this.handlePasswordShow}
                            >
                              <span
                                className={
                                  isPasswordShown
                                    ? 'fa fa-eye'
                                    : 'fa fa-eye-slash'
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* <!-- First Name --> */}
                      <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input
                          id="firstname"
                          type="text"
                          className="form-control"
                          name="firstname"
                          value={profile.firstName}
                          onChange={e =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                firstName: e.target.value,
                              },
                            })
                          }
                          required
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
                          value={profile.lastName}
                          onChange={e =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                lastName: e.target.value,
                              },
                            })
                          }
                          required
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
                          value={profile.vnName}
                          onChange={e =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                vnName: e.target.value,
                              },
                            })
                          }
                          required
                        />
                      </div>

                      {/* <!-- Gender --> */}
                      <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <Select
                          defaultValue={reactSelect.genderValue}
                          value={reactSelect.genderValue}
                          options={reactSelect.genderOptions}
                          placeholder="Select Gender"
                          onChange={selectedOption => {
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                gender: selectedOption.value,
                              },
                              reactSelect: {
                                ...this.state.reactSelect,
                                genderValue: selectedOption,
                              },
                            });
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
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
                          selected={profile.joinDate}
                          onChange={date =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                joinDate: date,
                              },
                            })
                          }
                          dateFormat="MMM dd, yyyy"
                        />
                      </div>

                      {/* <!-- Talents --> */}
                      <div className="form-group">
                        <label htmlFor="talents">Capabilities</label>
                        <TagsInput
                          id="talents"
                          className="form-control"
                          value={profile.talents}
                          maxTags={4}
                          onChange={tags =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                talents: tags,
                              },
                            })
                          }
                        />
                      </div>

                      {/* <!-- Position Title --> */}
                      <div className="form-group">
                        <label htmlFor="postitle">Position Title</label>
                        <Select
                          defaultValue={reactSelect.titleValue}
                          value={reactSelect.titleValue}
                          options={reactSelect.titleOptions}
                          placeholder="Select Position Title"
                          onChange={selectedOption => {
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                posTitle: selectedOption.value,
                              },
                              reactSelect: {
                                ...this.state.reactSelect,
                                titleValue: selectedOption,
                              },
                            });
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
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
                          value={profile.jobLevel}
                          onChange={e =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                jobLevel: e.target.value,
                              },
                            })
                          }
                          required
                        />
                      </div>

                      {/* <!-- Base --> */}
                      <div className="form-group">
                        <label htmlFor="base">Base</label>
                        <Select
                          defaultValue={reactSelect.baseValue}
                          value={reactSelect.baseValue}
                          options={reactSelect.baseOptions}
                          placeholder="Select Base"
                          onChange={selectedOption => {
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                base: selectedOption.value,
                              },
                              reactSelect: {
                                ...this.state.reactSelect,
                                baseValue: selectedOption,
                              },
                            });
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                          valueKey="value"
                          labelKey="label"
                          isDisabled={reactSelect.baseSelectDisabled}
                        />
                      </div>

                      {/* <!-- Entity Code --> */}
                      <div className="form-group">
                        <label htmlFor="entcode">Entity Code</label>
                        <Select
                          defaultValue={reactSelect.entCodeValue}
                          value={reactSelect.entCodeValue}
                          options={reactSelect.entCodeOptions}
                          placeholder="Select Entity Code"
                          onChange={selectedOption => {
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                entCode: selectedOption.value,
                              },
                              reactSelect: {
                                ...this.state.reactSelect,
                                entCodeValue: selectedOption,
                              },
                            });
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                          valueKey="value"
                          labelKey="label"
                          isDisabled={reactSelect.entCodeSelectDisabled}
                        />
                      </div>

                      {/* <!-- Roles --> */}
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
                            onClick={this.handleRoleAdminClick}
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
                            onClick={this.handleRoleProjManClick}
                          >
                            {roles.projMan
                              ? 'Project Manager'
                              : 'Not Proj. Manager'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* <!-- Third Col --> */}
                    <div className="col-md-4">
                      {/* <!-- Country --> */}
                      <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <Select
                          defaultValue={reactSelect.countryValue}
                          value={reactSelect.countryValue}
                          options={reactSelect.countryOptions}
                          placeholder="Select Country"
                          onChange={selectedOption => {
                            this.setState({
                              reactSelect: {
                                ...this.state.reactSelect,
                                countryValue: selectedOption,
                                baseSelectDisabled:
                                  selectedOption.isBaseDisabled,
                                baseOptions: _.where(
                                  reactSelect.baseAllOptions,
                                  {
                                    country: selectedOption.value,
                                  }
                                ),
                                baseValue: _.findWhere(
                                  reactSelect.baseAllOptions,
                                  {
                                    country: selectedOption.value,
                                  }
                                ),
                                entCodeSelectDisabled:
                                  selectedOption.isEntCodeDisabled,
                                entCodeOptions: _.where(
                                  reactSelect.entCodeAllOptions,
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
                              profile: {
                                ...this.state.profile,
                                country: selectedOption.value,
                                base: _.findWhere(reactSelect.baseAllOptions, {
                                  country: selectedOption.value,
                                }).value,
                                entCode: _.findWhere(
                                  reactSelect.entCodeAllOptions,
                                  {
                                    country: selectedOption.value,
                                  }
                                ).value,
                              },
                            });
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                        />
                      </div>

                      {/* <!-- Employment Type --> */}
                      <div className="form-group">
                        <label htmlFor="emptype">Employment Type</label>
                        <Select
                          defaultValue={reactSelect.empTypeValue}
                          value={reactSelect.empTypeValue}
                          options={reactSelect.empTypeOptions}
                          placeholder="Select Employment Type"
                          onChange={selectedOption => {
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                empType: selectedOption.value,
                              },
                              reactSelect: {
                                ...this.state.reactSelect,
                                empTypeValue: selectedOption,
                              },
                            });
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                        />
                      </div>

                      {/* <!-- Hours Per Week --> */}
                      <div className="form-group">
                        <label htmlFor="hpw">Hours Per Week</label>
                        <input
                          id="hpw"
                          type="number"
                          className="form-control"
                          name="hpw"
                          value={profile.hPW}
                          onChange={e =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                hPW: parseInt(e.target.value),
                              },
                            })
                          }
                          required
                          disabled={profile.empType === 'Permanent'}
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
                          value={profile.costCenter}
                          onChange={e =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                costCenter: e.target.value,
                              },
                            })
                          }
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
                          value={profile.portfolios}
                          onChange={e =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                portfolios: e.target.value,
                              },
                            })
                          }
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
                          value={profile.offering}
                          onChange={e =>
                            this.setState({
                              profile: {
                                ...this.state.profile,
                                offering: e.target.value,
                              },
                            })
                          }
                          required
                          disabled
                        />
                      </div>

                      {/* <!-- Active --> */}
                      <div className="form-group">
                        <button
                          type="button"
                          className={
                            disabled
                              ? 'btn btn-block btn-secondary'
                              : 'btn btn-block btn-primary'
                          }
                          onClick={this.handleActiveClick}
                        >
                          {disabled ? 'Inactive' : 'Active'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="form-group no-margin">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-2"
                    >
                      Create
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

CreateEmployee.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateEmployee;
