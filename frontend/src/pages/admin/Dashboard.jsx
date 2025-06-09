import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/admin/adminSidebar";
import { FaUser, FaSeedling, FaBug } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { listUsers, getAllRice, getAllPestDisease, getTopPestPredictions } from "../../services/api";
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        riceCount: 0,
        pestCount: 0
    });
    const [topPests, setTopPests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, rice, pests, predictions] = await Promise.all([
                    listUsers(),
                    getAllRice(),
                    getAllPestDisease(),
                    getTopPestPredictions()
                ]);
                
                setStats({
                    userCount: users.data?.data?.length || 0,
                    riceCount: rice.data?.riceList?.data?.length || 0,
                    pestCount: pests.data?.pestDiseaseList?.data?.length || 0
                });

                const result = predictions?.data?.data?.data;
                if (Array.isArray(result) && result.length > 0) {
                    setTopPests(result);
                }
                console.log("Top Pests Raw:", predictions.data);
                console.log("Extracted Top Pests:", predictions.data?.data?.data);
                console.log(predictions.data?.data);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } 
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <SidebarAdmin />
            <div className="dashboard-content">
                <h1>Bảng Điều Khiển</h1>
                
                
                    <>
                        <div className="stats">
                            <div className="stat-card">
                                <FaUser className="stat-icon" />
                                <div className="stat-info">
                                    <h2>Người dùng</h2>
                                    <p>{stats.userCount}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FaSeedling className="stat-icon" />
                                <div className="stat-info">
                                    <h2>Giống lúa</h2>
                                    <p>{stats.riceCount}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FaBug className="stat-icon" />
                                <div className="stat-info">
                                    <h2>Sâu bệnh</h2>
                                    <p>{stats.pestCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="chart-section">
                            <h2>Top 3 Sâu Bệnh Được Nhận Diện Nhiều Nhất</h2>
                            <div className="chart-container">
                                {topPests.length > 0 ? (
                                    <BarChart
                                        width={600}
                                        height={400}
                                        data={topPests}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="name"
                                            angle={-15}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis label={{ value: 'Số lần nhận diện', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar 
                                            dataKey="count" 
                                            fill="#75a674" 
                                            name="Số lần nhận diện"
                                        />
                                    </BarChart>
                                ) : (
                                    <div className="no-data">Chưa có dữ liệu nhận diện</div>
                                )}
                            </div>
                        </div>
                    </>
                
            </div>
        </div>
    );
};

export default Dashboard;