import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Table } from 'antd';
import Axios from 'axios';

const { Title } = Typography;

function AdminDashboardPage() {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch all users
        Axios.get('/api/users/getAllUsers')
            .then(response => {
                if (response.data.success) {
                    setUsers(response.data.users);
                } else {
                    alert('Failed to fetch users');
                }
            });

        // Fetch all products
        Axios.get('/api/product/getAllProducts')
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.products);
                } else {
                    alert('Failed to fetch products');
                }
            });
    }, []);

    // ==========================================
    // Table Column Definitions
    // ==========================================
    const userColumns = [
        { title: 'First Name', dataIndex: 'name', key: 'name' },
        { title: 'Last Name', dataIndex: 'lastname', key: 'lastname' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { 
            title: 'Account Type', 
            dataIndex: 'role', 
            key: 'role',
            // If the role is 1, print 'Admin', otherwise print 'User'
            render: role => role === 1 ? 'Admin' : 'User' 
        }
    ];

    const productColumns = [
        { title: 'Product Title', dataIndex: 'title', key: 'title' },
        { title: 'Price ($)', dataIndex: 'price', key: 'price' },
        { title: 'Quantity Sold', dataIndex: 'sold', key: 'sold' },
        { title: 'Total Views', dataIndex: 'views', key: 'views' }
    ];

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Admin Control Panel</Title>
            </div>

            {/* Top Statistics Cards */}
            <Row gutter={[16, 16]}>
                <Col lg={8} md={12} xs={24}>
                    <Card title="Total Users" bordered={true} style={{ textAlign: 'center' }}>
                        <Title level={3}>{users.length}</Title>
                    </Card>
                </Col>
                <Col lg={8} md={12} xs={24}>
                    <Card title="Total Products" bordered={true} style={{ textAlign: 'center' }}>
                        <Title level={3}>{products.length}</Title>
                    </Card>
                </Col>
                <Col lg={8} md={12} xs={24}>
                    <Card title="Total Sales" bordered={true} style={{ textAlign: 'center' }}>
                        <Title level={3}>0</Title> 
                    </Card>
                </Col>
            </Row>

            {/* Registered Users Table */}
            <div style={{ marginTop: '3rem' }}>
                <Title level={3}>User Directory</Title>
                <Table 
                    columns={userColumns} 
                    dataSource={users} 
                    rowKey="_id" 
                    pagination={{ pageSize: 5 }} 
                    bordered
                />
            </div>

            {/* Product Inventory Table */}
            <div style={{ marginTop: '3rem', paddingBottom: '3rem' }}>
                <Title level={3}>Product Inventory</Title>
                <Table 
                    columns={productColumns} 
                    dataSource={products} 
                    rowKey="_id" 
                    pagination={{ pageSize: 5 }} 
                    bordered
                />
            </div>
            
        </div>
    );
}

export default AdminDashboardPage;
