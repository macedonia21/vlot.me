import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { NotificationManager } from 'react-notifications';
import { Roles } from 'meteor/alanning:roles';
import Select from 'react-select';

// import components

// import styles
import './ProjectCreate.scss';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-notifications/lib/notifications.css';

class ProjectCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginRoles: {
        admin: false,
        projMan: false,
      },
      project: {
        projectName: '',
        engagementCode: '',
        _pmId: '',
        startDate: new Date(),
        endDate: new Date(),
        status: 'Presales',
        remark: '',
        disabled: false,
      },
      reactSelect: {
        pmIdValue: null,
        statusValue: { value: 'Presales', label: 'Presales' },
        statusOptions: [
          {
            value: 'Presales',
            label: 'Presales',
          },
          {
            value: 'Kick-off',
            label: 'Kick-off',
          },
          {
            value: 'Blueprint',
            label: 'Blueprint',
          },
          {
            value: 'Realization',
            label: 'Realization',
          },
          {
            value: 'SIT',
            label: 'SIT',
          },
          {
            value: 'UAT',
            label: 'UAT',
          },
          {
            value: 'Go-live',
            label: 'Go-live',
          },
          {
            value: 'Go-live Support',
            label: 'Go-live Support',
          },
        ],
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.customFilter = this.customFilter.bind(this);
    this.handleActiveClick = this.handleActiveClick.bind(this);
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

  customFilter(option, searchText) {
    if (
      option.data.profile.fullName
        .toLowerCase()
        .includes(searchText.toLowerCase())
    ) {
      return true;
    }
    return false;
  }

  handleActiveClick() {
    this.setState({
      project: {
        ...this.state.project,
        disabled: !this.state.project.disabled,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { project } = this.state;
    Meteor.call('project.create', project, (err, res) => {
      if (err) {
        NotificationManager.error(
          `Cannot create: ${err.message}`,
          'Error',
          3000
        );
      } else {
        NotificationManager.success('New project is created', 'Success', 3000);
        return this.props.history.push('/project');
      }
    });
  }

  render() {
    const { loggedIn, usersReady, users } = this.props;
    const { loginRoles, project, reactSelect } = this.state;

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

    // Selects Component Options
    const pmIdSelectOptions = _.map(users, user => {
      return {
        value: user._id,
        label: user.profile.fullName,
        profile: user.profile,
      };
    });

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
        <div
          className="card mx-auto"
          style={{ width: '28rem', maxWidth: '80%' }}
        >
          <div className="card-header">
            <div className="card-body">
              <h1 className="card-title text-center">Create Project</h1>
              {!loginRoles.admin && (
                <h4 className="text-center text-danger">
                  You are not authorized to create Project
                </h4>
              )}
              {loginRoles.admin && (
                <form onSubmit={this.handleSubmit}>
                  {/* <!-- First Col --> */}
                  <div className="row">
                    <div className="col-md-12">
                      {/* <!-- Project Name --> */}
                      <div className="form-group">
                        <label htmlFor="projectname">Project Name</label>
                        <input
                          id="projectname"
                          type="text"
                          className="form-control"
                          name="projectname"
                          value={project.projectName}
                          onChange={e =>
                            this.setState({
                              project: {
                                ...this.state.project,
                                projectName: e.target.value,
                              },
                            })
                          }
                          required
                        />
                      </div>

                      {/* <!-- Engagement Code --> */}
                      <div className="form-group">
                        <label htmlFor="engagementcode">Engagement Code</label>
                        <input
                          id="engagementcode"
                          type="text"
                          className="form-control"
                          name="engagementcode"
                          value={project.engagementCode}
                          onChange={e =>
                            this.setState({
                              project: {
                                ...this.state.project,
                                engagementCode: e.target.value,
                              },
                            })
                          }
                          required
                        />
                      </div>

                      {/* <!-- Project Manager --> */}
                      <div className="form-group">
                        <label htmlFor="pmid">Project Manager</label>
                        <Select
                          value={reactSelect.pmIdValue}
                          options={pmIdSelectOptions}
                          placeholder="Select PM"
                          onChange={selectedOption => {
                            this.setState({
                              newAssignment: {
                                ...this.state.newAssignment,
                                _pmId: selectedOption
                                  ? selectedOption.value
                                  : '',
                              },
                              reactSelect: {
                                ...this.state.reactSelect,
                                pmIdValue: selectedOption,
                              },
                            });
                          }}
                          filterOption={this.customFilter}
                          isClearable="true"
                          styles={reactSelectStyle}
                          valueKey="value"
                          labelKey="label"
                          formatOptionLabel={({ profile, label }) => (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {label}
                              &nbsp;
                              <span className="badge badge-pill badge-warning">
                                {profile.posTitle}
                              </span>
                            </div>
                          )}
                        />
                      </div>

                      {/* <!-- Start Date --> */}
                      <div className="form-group">
                        <label htmlFor="startdate">Start Date</label>
                        <DatePicker
                          className="form-control"
                          selected={project.startDate}
                          onChange={date =>
                            this.setState({
                              project: {
                                ...this.state.project,
                                startDate: date,
                              },
                            })
                          }
                          maxDate={project.endDate}
                          dateFormat="MMM dd, yyyy"
                        />
                      </div>

                      {/* <!-- End Date --> */}
                      <div className="form-group">
                        <label htmlFor="enddate">End Date</label>
                        <DatePicker
                          className="form-control"
                          selected={project.endDate}
                          onChange={date =>
                            this.setState({
                              project: {
                                ...this.state.project,
                                endDate: date,
                              },
                            })
                          }
                          minDate={project.startDate}
                          dateFormat="MMM dd, yyyy"
                        />
                      </div>

                      {/* <!-- Status --> */}
                      <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <Select
                          defaultValue={reactSelect.statusOptions[0]}
                          value={reactSelect.statusValue}
                          options={reactSelect.statusOptions}
                          placeholder="Select Status"
                          onChange={selectedOption => {
                            this.setState({
                              project: {
                                ...this.state.project,
                                status: selectedOption.value,
                              },
                              reactSelect: {
                                ...this.state.reactSelect,
                                statusValue: selectedOption,
                              },
                            });
                          }}
                          styles={reactSelectStyle}
                          isSearchable={false}
                        />
                      </div>

                      {/* <!-- Remark --> */}
                      <div className="form-group">
                        <label htmlFor="remark">Remark</label>
                        <input
                          id="remark"
                          type="text"
                          className="form-control"
                          name="remark"
                          value={project.remark || ''}
                          onChange={e =>
                            this.setState({
                              project: {
                                ...this.state.project,
                                remark: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      {/* <!-- Active --> */}
                      <div className="form-group">
                        <button
                          type="button"
                          className={
                            project.disabled
                              ? 'btn btn-block btn-secondary'
                              : 'btn btn-block btn-primary'
                          }
                          onClick={this.handleActiveClick}
                        >
                          {project.disabled ? 'Inactive' : 'Active'}
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

ProjectCreate.defaultProps = {
  // users: null, remote example (if using ddp)
  users: null,
};

ProjectCreate.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  usersReady: PropTypes.bool.isRequired,
  users: Meteor.user() ? PropTypes.array.isRequired : () => null,
};

export default withTracker(() => {
  const usersSub = Meteor.subscribe('users.all'); // publication needs to be set on remote server
  const users = Meteor.users.find().fetch();
  const usersReady = usersSub.ready() && !!users;

  return {
    usersReady,
    users,
  };
})(ProjectCreate);
