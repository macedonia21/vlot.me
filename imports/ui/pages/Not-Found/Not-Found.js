import React from 'react';
import { NavLink } from 'react-router-dom';

import './Not-Found.scss';

const NotFound = () => (
  <div className="not-found-page">
    <div className="not-found-content">
      <h1>Không tìm thấy trang</h1>
      <NavLink to="/ketqua">
        <h3>Xem kết quả</h3>
      </NavLink>
    </div>
  </div>
);

export default NotFound;
