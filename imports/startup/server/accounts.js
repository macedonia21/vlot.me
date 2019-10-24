/**
 * Accounts Setup
 */

import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  // Use provided profile in options, or create an empty object
  user.profile = options.profile || {};

  // Additional fields
  user.profile.firstName = options.profile.firstName;
  user.profile.lastName = options.profile.lastName;
  user.profile.fullName = `${options.profile.firstName} ${
    options.profile.lastName
  }`;
  user.profile.vnName = options.profile.vnName;
  user.profile.entCode = options.profile.entCode;
  user.profile.country = options.profile.country;
  user.profile.joinDate = options.profile.joinDate;
  user.profile.base = options.profile.base;
  user.profile.empType = options.profile.empType;
  user.profile.indicator = '';
  user.profile.indAlignment = '';
  user.profile.costCenter = options.profile.costCenter;
  user.profile.portfolios = options.profile.portfolios;
  user.profile.offering = options.profile.offering;
  user.profile.posTitle = options.profile.posTitle;
  user.profile.jobLevel = options.profile.jobLevel;
  user.profile.gender = options.profile.gender;
  user.profile.talents = options.profile.talents;
  user.profile.hPW = options.profile.hPW;
  user.profile._counsellorId = options.profile._counsellorId;
  user.profile.email = options.email;

  user.disabled = options.disabled;
  // Returns the user object
  return user;
});

Accounts.validateLoginAttempt(function(attemptInfo) {
  if (attemptInfo.type === 'resume') return true;

  if (attemptInfo.methodName === 'createUser') return false;

  if (attemptInfo.user.disabled) return false;

  if (attemptInfo.methodName === 'login' && attemptInfo.allowed) {
    let verified = false;
    const { email } = attemptInfo.methodArguments[0].user;
    attemptInfo.user.emails.forEach(function(value, index) {
      if (email === value.address && value.verified) verified = true;
    });
  }

  return true;
});
