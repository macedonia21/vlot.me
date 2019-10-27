/**
 * Register each api
 * import private server methods and server publications
 */

// users api
import '../../api/users/publications.js';
import '../../api/users/hooks.js';

// counters api (example)
import '../../api/counters/methods.js';
import '../../api/counters/publications.js';

// projects api
import '../../api/projects/publications.js';

// assignments api
import '../../api/assignments/publications.js';

// rounds api
import '../../api/rounds/methods.js';
import '../../api/rounds/publications.js';

// import another api
import '../../api/method.js';
