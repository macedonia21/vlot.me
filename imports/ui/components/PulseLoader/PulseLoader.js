import React from 'react';
const { Loader } = require('react-loaders');

import './PulseLoader.scss';
import 'loaders.css/src/animations/ball-scale.scss';

const PulseLoader = () => (
  <div className="div-loader">
    <Loader type="ball-scale" active />
  </div>
);

export default PulseLoader;
