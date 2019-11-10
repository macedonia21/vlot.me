// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment/moment';
import { Jobs } from 'meteor/msavin:sjobs';

Meteor.startup(() => {
  // code to run on server at startup
  // Initialize accounts
  if (Meteor.users.find().count() === 0) {
    // Create Admin account
    const adminId = Accounts.createUser({
      email: Meteor.settings.private.adminName,
      password: Meteor.settings.private.adminPass,
      disabled: false,
    });

    if (adminId) {
      Roles.addUsersToRoles(
        adminId,
        ['user', 'admin', 'superadmin'],
        Roles.GLOBAL_GROUP
      );
    }
  }

  Slingshot.createDirective('myImageUploads', Slingshot.S3Storage, {
    AWSAccessKeyId: Meteor.settings.private.AWSAccessKeyId,
    AWSSecretAccessKey: Meteor.settings.private.AWSSecretAccessKey,
    bucket: 'dcrs',
    acl: 'public-read',
    region: Meteor.settings.private.region,
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
    maxSize: 1 * 1024 * 1024, // 1 MB (use null for unlimited).

    authorize(file, metaContext) {
      // Deny uploads if user is not logged in.
      if (!this.userId) {
        const message = 'Please login before posting files';
        throw new Meteor.Error('Login Required', message);
      }

      return true;
    },

    key(file, metaContext) {
      // User's image url with ._id attached:
      return `${metaContext.avatarId}/${Date.now()}-${file.name}`;
    },
  });
});
