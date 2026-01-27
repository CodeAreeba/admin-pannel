import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../../DAL/fetch';
import { useNavigate } from 'react-router-dom';
import { FaDollarSign } from "react-icons/fa6";
import { LuShoppingBag } from "react-icons/lu";
import { AiOutlineAppstore } from "react-icons/ai";
import { HiOutlineCube } from "react-icons/hi";
import { LuUsers } from "react-icons/lu";
import { LuRefreshCcw } from "react-icons/lu";
import { RiErrorWarningLine } from "react-icons/ri";
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchDashboardStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
      console.error('Dashboard API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'delivered': 'status-delivered',
      'shipped': 'status-shipped',
      'processing': 'status-processing',
      'cancelled': 'status-cancelled'
    };
    return statusColors[status] || 'status-default';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <RiErrorWarningLine />
          <p>{error}</p>
          <button onClick={loadDashboardStats} className="retry-btn">
            <LuRefreshCcw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back! Your store’s latest updates are ready.</p>
        </div>
        <button onClick={loadDashboardStats} className="refresh-btn">
          <LuRefreshCcw className="refresh-icon" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card-revenue">
          <div className="stat-icon-wrapper">
            <FaDollarSign className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <h2 className="stat-value">{formatCurrency(stats.totalRevenue)}</h2>
            <p className="stat-change positive">+12.5% from last month</p>
          </div>
        </div>

        <div className="stat-card stat-card-orders">
          <div className="stat-icon-wrapper">
            <LuShoppingBag className="stat-icon"/>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h2 className="stat-value">{stats.totalOrders}</h2>
            <p className="stat-change positive">+{stats.totalOrders} orders</p>
          </div>
        </div>

        <div className="stat-card stat-card-products">
          <div className="stat-icon-wrapper">
           <AiOutlineAppstore className="stat-icon"/>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h2 className="stat-value">{stats.totalProducts}</h2>
            <p className="stat-change neutral">{stats.totalVariants} variants</p>
          </div>
        </div>

        <div className="stat-card stat-card-inventory">
          <div className="stat-icon-wrapper">
            <HiOutlineCube className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Inventory</p>
            <h2 className="stat-value">{stats.totalInventory}</h2>
            <p className="stat-change warning">{stats.lowStockCount} low stock alerts</p>
          </div>
        </div>

        <div className="stat-card stat-card-users">
          <div className="stat-icon-wrapper">
            <LuUsers className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <h2 className="stat-value">{stats.totalUsers}</h2>
            <p className="stat-change neutral">Active customers</p>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="content-grid">
        {/* Best Selling Products Table */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Best Selling Products</h3>
          </div>
          <div className="card-body">
            {stats.topSellingProducts && stats.topSellingProducts.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Product Name</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topSellingProducts.map((product, index) => (
                      <tr key={product._id}>
                        <td>
                          <div className="rank-badge">#{index + 1}</div>
                        </td>
                        <td>
                          <span className="product-name">{product.name}</span>
                        </td>
                        <td>
                          <span className="units-sold">{product.totalSold} units</span>
                        </td>
                        <td>
                          <span className="revenue-text">{formatCurrency(product.revenue)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>No sales data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <span className="card-link" onClick={() => navigate('/orders')}>View All</span>
          </div>
          <div className="card-body">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <div className="customer-info-cell">
                            <span className="customer-email">{order.user.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className="order-amount-text">{formatCurrency(order.totalAmount)}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="order-info-cell">
                            <span className="order-date">{formatDate(order.createdAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">Quick Analytics</h3>
          </div>
          <div className="card-body">
            <div className="analytics-grid">
              <div className="analytics-item">
                <div className="analytics-label">Average Order Value</div>
                <div className="analytics-value">
                  {formatCurrency(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}
                </div>
              </div>
              <div className="analytics-item">
                <div className="analytics-label">Products per Order</div>
                <div className="analytics-value">
                  {stats.totalOrders > 0 ? (stats.totalProducts / stats.totalOrders).toFixed(1) : '0'}
                </div>
              </div>
              <div className="analytics-item">
                <div className="analytics-label">Inventory Turnover</div>
                <div className="analytics-value">
                  {stats.totalInventory > 0 ? ((stats.totalProducts / stats.totalInventory) * 100).toFixed(1) + '%' : '0%'}
                </div>
              </div>
              <div className="analytics-item">
                <div className="analytics-label">Low Stock Items</div>
                <div className="analytics-value warning-value">{stats.lowStockCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;