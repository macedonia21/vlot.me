import { Meteor } from 'meteor/meteor';

// import counter collection and common methods
import '../../api/users/methods';

// import counter collection and common methods
import '../../api/counters/counters';
import '../../api/counters/methods';

Meteor.startup(() => {
  Slingshot.fileRestrictions('myImageUploads', {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
    maxSize: 1 * 512 * 512, // 1 MB (use null for unlimited).
  });
});
