import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
 return (
    // The display: 'flex' and alignItems: 'center' forces a perfect horizontal line
    <Menu mode={props.mode} style={{ display: 'flex', alignItems: 'center', borderBottom: 'none' }}>
        <Menu.Item key="mail">
            <a href="/">Home</a>
        </Menu.Item>
        <Menu.Item key="blog">
            <a href="/blog">Blogs</a>
        </Menu.Item>
    </Menu>
)
}

export default LeftMenu
