// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Projects from './projects.js';

if (Meteor.isServer) {
  Meteor.publish('projects.all', function() {
    if (Roles.userIsInRole(this.userId, ['admin', 'projman', 'user'])) {
      return Projects.find();
    }
    return this.ready();
  });
}
