// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment/moment';

Meteor.startup(() => {
  // code to run on server at startup
  // Initialize accounts
  if (Meteor.users.find().count() === 0) {
    // Create Admin account
    const adminId = Accounts.createUser({
      email: 'htuan@deloitte.com',
      password: '@nhTuan2184',
      profile: {
        firstName: 'Tuan',
        lastName: 'Hoang',
        vnName: 'Hoàng Vũ Anh Tuấn',
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
        posTitle: 'SC',
        jobLevel: 'SC',
        gender: 'M',
        _counsellorId: '',
        talents: ['ABAP'],
        fullName: 'Tuan Hoang',
        email: 'htuan@deloitte.com',
        hPW: 40,
      },
    });

    if (adminId) {
      Roles.addUsersToRoles(adminId, ['user', 'admin'], Roles.GLOBAL_GROUP);
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
