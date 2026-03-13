import React from 'react';
import { Menu, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RightMenu(props) {
  const user = useSelector(state => state.user);
  const history = useHistory();

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        history.push("/login");
      } else {
        alert('Log Out Failed');
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        {/* The safety check + JSX Fragment wrapper */}
        {user.userData && user.userData.isAdmin && (
          <>
            <Menu.Item key="upload">
              <a href="/product/upload">Upload</a>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <a href="/admin/dashboard">Dashboard</a>
            </Menu.Item>
          </>
        )}

        <Menu.Item key="history">
          <a href="/history">History</a>
        </Menu.Item>
        
        <Menu.Item key="cart">
          {/* Added a safety check for the cart length to prevent page crashes */}
          <Badge count={user.userData && user.userData.cart ? user.userData.cart.length : 0}>
            <a href="/user/cart">
              <ShoppingCartOutlined style={{ fontSize: 30, marginBottom: 4 }} />
            </a>
          </Badge>
        </Menu.Item>
        
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default RightMenu;
