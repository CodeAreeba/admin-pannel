import React, { useEffect, useState } from "react";
import { Download, TrendingUp, Package } from "lucide-react";
import { GiMoneyStack } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { GrUserWorker } from "react-icons/gr";
import "./Dashboard.css";
// import { fetchDashboard } from "../../DAL/fetch"; // ❌ Commented - Backend nahi hai
// import { exportDashboardPDF } from "../../Utils/ExportPdf";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatPKR = (num) => {
    return num?.toLocaleString("en-PK", { style: "currency", currency: "PKR" });
  };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        
        // ❌ Backend call commented out
        // const res = await fetchDashboard();

        // 🔥 FAKE DATA - Backend ke bagair
        const res = {
          products: {
            totalProducts: {
              quantity: 1250,
              price: 3750000
            },
            totalSold: {
              quantity: 850,
              sale: 2550000
            },
            today: {
              quantity: 25,
              sale: 75000
            },
            yesterday: {
              quantity: 30,
              sale: 90000
            },
            thisWeek: {
              quantity: 180,
              sale: 540000
            },
            thisMonth: {
              quantity: 650,
              sale: 1950000
            }
          },
          pendingAmount: 450000,
          expense: {
            totalExpense: 850000,
            today: 15000,
            yesterday: 12000,
            thisWeek: 95000,
            thisMonth: 285000
          },
          labourCost: {
            totalLabourCost: 560000,
            today: 8000,
            yesterday: 7500,
            thisWeek: 52000,
            thisMonth: 180000,
            lastMonth: 175000
          }
        };

        // Simulate API delay
        setTimeout(() => {
          if (res) {
            setDashboardData(res);
          } else {
            setDashboardData(null);
          }
          setLoading(false);
        }, 500);

      } catch (err) {
        console.error("❌ Error fetching dashboard:", err);
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  if (loading)
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );

  if (!dashboardData)
    return <p className="dashboard-loading">No data available</p>;

  return (
    <main className="dashboard-container">
      <div className="dashboard-wrapper">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Business performance overview.</p>
          </div>

          {/* <button className="export-button" onClick={() => exportDashboardPDF(dashboardData)}>
            <Download size={18} />
            Export Report
          </button> */}

        </div>

        {/* Summary Cards */}
        <div className="summary-cards-grid">
          <div className="dashboard-card card-blue" onClick={() => { navigate("/stockData") }}>
            <div className="card-header">
              <Package size={24} />
              <span>Total Products</span>
            </div>
            <div className="card-value">
              {dashboardData.products.totalProducts.quantity}
            </div>
            <div className="card-subvalue">
              {formatPKR(dashboardData.products.totalProducts.price)}
            </div>
          </div>

          <div className="dashboard-card card-emerald" onClick={() => { navigate("/salesReport") }}>
            <div className="card-header">
              <TrendingUp size={24} />
              <span>Total Sold</span>
            </div>
            <div className="card-value">
              {dashboardData.products.totalSold.quantity}
            </div>
            <div className="card-subvalue">
              {formatPKR(dashboardData.products.totalSold.sale)}
            </div>
          </div>

          <div className="dashboard-card card-amber" onClick={() => { navigate("/PendingAmount") }}>
            <div className="card-header">
              <GiTakeMyMoney size={24} />
              <span>Pending Amount</span>
            </div>
            <div className="card-value">
              {formatPKR(dashboardData.pendingAmount)}
            </div>
            <div className="card-subvalue">To be collected</div>
          </div>

          <div className="dashboard-card card-red" onClick={() => { navigate("/ExpenseData") }}>
            <div className="card-header">
             <GiMoneyStack size={24} />
              <span>Total Expense</span>
            </div>
            <div className="card-value">
              {formatPKR(dashboardData.expense.totalExpense)}
            </div>
          </div>
          <div className="dashboard-card card-gray">
            <div className="card-header">
              <GrUserWorker size={24} />
              <span>Total Labour Cost</span>
            </div>
            <div className="card-value">
              {formatPKR(dashboardData.labourCost.totalLabourCost)}
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="main-grid">

          {/* Product Overview */}
          <div className="section-products">
            <div className="section-header">
              <Package size={24} />
              <div>
                <h2>Products & Sales Overview</h2>
                <p>Track inventory and sales performance</p>
              </div>
            </div>

            <div className="metrics-grid">
              {[
                { label: "Today", data: dashboardData.products.today },
                { label: "Yesterday", data: dashboardData.products.yesterday },
                { label: "This Week", data: dashboardData.products.thisWeek },
                { label: "This Month", data: dashboardData.products.thisMonth },
              ].map((item) => (
                <div key={item.label} className="metric-card">
                  <div className="metric-label">{item.label}</div>
                  <div className="metric-value">{item.data.quantity}</div>
                  <div className="metric-subvalue">{formatPKR(item.data.sale)}</div>
                </div>
              ))}
            </div>
            {/* /////////////////// Labour Cost Overview //////////////////// */}
            <div className="section-header labour">
              <GrUserWorker size={24} />
              <div>
                <h2>Labour Cost Overview</h2>
                <p>Track and monitor labour cost</p>
              </div>
            </div>

            <div className="metrics-grid">
              {[
                { label: "Today", value: dashboardData.labourCost.today },
                { label: "Yesterday", value: dashboardData.labourCost.yesterday },
                { label: "This Week", value: dashboardData.labourCost.thisWeek },
                { label: "This Month", value: dashboardData.labourCost.thisMonth },
                { label: "Last Month", value: dashboardData.labourCost.lastMonth },
              ].map((item) => (
                <div key={item.label} className="metric-card">
                  <div className="metric-label">{item.label}</div>
                  <div className="metric-value">{formatPKR(item.value)}</div>
                </div>
              ))}
            </div>


          </div>

          {/* Expenses */}
          <div className="section-expenses">
            <div className="section-header">
              <GiMoneyStack size={24} />
              <div>
                <h2>Expenses</h2>
                <p>Expense tracking</p>
              </div>
            </div>

            <div className="metrics-grid-expense">
              {[
                { label: "Today", value: dashboardData.expense.today },
                { label: "Yesterday", value: dashboardData.expense.yesterday },
                { label: "This Week", value: dashboardData.expense.thisWeek },
                { label: "This Month", value: dashboardData.expense.thisMonth },
              ].map((item) => (
                <div key={item.label} className="metric-card">
                  <div className="metric-label">{item.label}</div>
                  <div className="metric-value">{formatPKR(item.value)}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Dashboard;