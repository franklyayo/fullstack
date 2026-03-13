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
        {/* Only render this item if the user is an Admin */}
       {/* The safety check: Make sure userData exists BEFORE checking isAdmin */}
        {user.userData && user.userData.isAdmin && (
            <> {/* <-- ADD THIS OPENING FRAGMENT */}
            <Menu.Item key="upload">
                <a href="/product/upload">Upload</a>
            </Menu.Item>
         <Menu.Item key="dashboard">
                <a href="/admin/dashboard">Dashboard</a>
        </Menu.Item>
         < /> {/* <-- ADD THIS CLOSING FRAGMENT */}
        )}
      
        <Menu.Item key="history">
          <a href="/history">History</a>
        </Menu.Item>
        <Menu.Item key="cart">
          <Badge count={user.userData && user.userData.cart.length}>
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
