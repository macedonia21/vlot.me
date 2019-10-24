import React from 'react';
const { Loader } = require('react-loaders');

import './PulseLoader.scss';
import 'loaders.css/src/animations/ball-grid-pulse.scss';

const PulseLoader = () => (
  <div className="div-loader">
    <Loader type="ball-grid-pulse" active />
  </div>
);

export default PulseLoader;
