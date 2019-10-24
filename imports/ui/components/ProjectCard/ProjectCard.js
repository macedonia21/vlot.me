import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { NavLink } from 'react-router-dom';

// collection
import Projects from '../../../api/projects/projects';

import './ProjectCard.scss';

const ProjectCard = ({ project, isAdmin, isProjMan }) => (
  <div className="col-xs-12 col-sm-6 col-md-4 proj-card">
    <div className="image-flip">
      <div className="mainflip">
        <div className="frontside">
          {project && (
            <div className={project.disabled ? 'card disabled-card' : 'card'}>
              <div className="card-body text-center">
                <p>
                  <img
                    className="img-fluid"
                    src="/img/project_placeholder.png"
                    alt="card image"
                  />
                </p>

                <h4 className="card-title">
                  {(isAdmin || isProjMan) && (
                    <div className="dropdown">
                      <a
                        className="dropdown-toggle"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="proj-name">{project.projectName}</span>
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <NavLink
                          className="dropdown-item"
                          to={`/project/${project._id}`}
                        >
                          {isAdmin ? 'Update Project' : 'Project Information'}
                        </NavLink>
                        {!project.disabled && (isAdmin || isProjMan) && (
                          <NavLink
                            className="dropdown-item"
                            to={`/project/assignment/${project._id}`}
                          >
                            Assignments
                          </NavLink>
                        )}
                      </div>
                    </div>
                  )}
                  {!isAdmin && !isProjMan && (
                    <div className="white-space-no-wrap">
                      <span className="proj-name">{project.projectName}</span>
                    </div>
                  )}
                </h4>

                <p className="card-text">
                  {`${moment(project.startDate).format(
                    'MMM DD, YYYY'
                  )} - ${moment(project.endDate).format('MMM DD, YYYY')}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

ProjectCard.propTypes = {
  project: PropTypes.object,
  isAdmin: PropTypes.bool.isRequired,
  isProjMan: PropTypes.bool.isRequired,
};

export default ProjectCard;
