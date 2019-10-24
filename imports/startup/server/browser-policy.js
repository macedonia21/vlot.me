/**
 * Browser Policy
 * Set security-related policies to be enforced by newer browsers.
 * These policies help prevent and mitigate common attacks like
 * cross-site scripting and clickjacking.
 */

import { BrowserPolicy } from 'meteor/browser-policy-common';

/**
 * allowed images
 */
const allowImageOrigin = [
  'via.placeholder.com',
  'dcrs.s3-ap-southeast-1.amazonaws.com',
];
allowImageOrigin.forEach(o => BrowserPolicy.content.allowImageOrigin(o));

/**
 * allowed scripts
 */
const allowScriptOrigin = ['www.gstatic.com', 'maps.googleapis.com'];
allowScriptOrigin.forEach(o => BrowserPolicy.content.allowScriptOrigin(o));

/**
 * allowed styles
 */
const allowStyleOrigin = ['www.gstatic.com'];
allowStyleOrigin.forEach(o => BrowserPolicy.content.allowStyleOrigin(o));
