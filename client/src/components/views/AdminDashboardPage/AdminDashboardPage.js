import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col } from 'antd';
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

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Admin Control Panel</Title>
            </div>

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
                        <Title level={3}>0</Title> {/* Placeholder for sales data */}
                    </Card>
                </Col>
            </Row>

            {/* In the future, we can add Ant Design <Table> components here to list the actual users and purchases */}
            
        </div>
    );
}

export default AdminDashboardPage;
