import React from 'react';
const { Loader } = require('react-loaders');

import './Spinner.scss';
import 'loaders.css/src/animations/ball-grid-pulse.scss';

const Spinner = () => (
  <div className="login-spinner">
    <Loader type="ball-grid-pulse" active />
  </div>
);

export default Spinner;
