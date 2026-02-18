import "../index.css";
import React, { useEffect } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

import useGlobalReducer from "../hooks/useGlobalReducer";

const Statistics = () => {
    const { store, actions } = useGlobalReducer();
    const { pending, interview, rejected, offer, total } = store.statistics || { pending: 0, interview: 0, rejected: 0, offer: 0, total: 0 };

    useEffect(() => {
        actions.getMyPostulations();
    }, []);

    const pieData = {
        labels: ["To apply / Pending", "Interview", "Offer", "Rejected"],
        datasets: [
            {
                data: [pending, interview, offer, rejected],
                backgroundColor: [
                    "#6b6b6b",
                    "#d48a2a",
                    "#2e9ca0",
                    "#533946",
                ],
                borderWidth: 0,
            },
        ],
    };

    // Derived KPIs
    const interviewRate = total > 0 ? ((interview / total) * 100).toFixed(0) : 0;
    const offerRate = interview > 0 ? ((offer / interview) * 100).toFixed(0) : 0; // Offer rate from interviews

    const progressElements = [
        { key: "Pending", value: pending, colorClass: "is-gray" },
        { key: "Interview", value: interview, colorClass: "is-orange" },
        { key: "Offer", value: offer, colorClass: "is-blue" },
        { key: "Rejected", value: rejected, colorClass: "is-purple" },
    ];

    // Calculate top companies from myKanban
    const myKanban = store.myKanban || [];
    const companyCounts = {};
    myKanban.forEach(card => {
        const company = card.company || "Unknown";
        companyCounts[company] = (companyCounts[company] || 0) + 1;
    });

    // Sort and take top 3
    const sortedCompanies = Object.entries(companyCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    const topCompaniesLabels = sortedCompanies.map(([name]) => name);
    const topCompaniesData = sortedCompanies.map(([, count]) => count);

    const barData = {
        labels: topCompaniesLabels.length > 0 ? topCompaniesLabels : ["No Data"],
        datasets: [
            {
                label: "Postulations",
                data: topCompaniesData.length > 0 ? topCompaniesData : [0],
                backgroundColor: "#21616a",
                borderRadius: 6,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#0f2c33",
                    font: { size: 12 },
                },
            },
        },
    };

    return (
        <main className="dashboard-page">
            <section className="dashboard-container">
                <div className="kpi-grid">
                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-briefcase-fill"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Total Postulations</p>
                            <h3 className="kpi-value">{total}</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Interview Rate</p>
                            <h3 className="kpi-value">{interviewRate}%</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-file-earmark-text-fill"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Offer Rate (from Itw)</p>
                            <h3 className="kpi-value">{offerRate}%</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-clock-history"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Avg Response</p>
                            <h3 className="kpi-value">-</h3>
                        </div>
                    </article>
                </div>

                <div className="dashboard-grid-2">
                    <section className="panel-card">
                        <header className="panel-header">
                            <h4 className="panel-title">Distribution by Status</h4>
                        </header>
                        <div className="panel-body">
                            <div className="chart-placeholder chart-pie">
                                <Pie data={pieData} options={chartOptions} />
                            </div>
                        </div>
                    </section>

                    <section className="panel-card">
                        <header className="panel-header">
                            <h4 className="panel-title">Companies with most postulations</h4>
                        </header>
                        <div className="panel-body">
                            <div className="chart-placeholder chart-bar">
                                <Bar data={barData} options={chartOptions} />
                            </div>
                        </div>
                    </section>
                </div>

                <section className="panel-card panel-full">
                    <header className="panel-header">
                        <h4 className="panel-title">Postulation Details</h4>
                    </header>
                    <div className="panel-body">
                        <div className="progress-list">
                            {progressElements.map((element) => {
                                const percentage = total === 0 ? 0 : (element.value / total) * 100;
                                return (
                                    <div className="progress-row" key={element.key}>
                                        <span className="progress-label">{element.key}</span>
                                        <div
                                            className="progress-track"
                                            aria-label={`${element.key} ${element.value}`}
                                        >
                                            <div
                                                className={`progress-fill ${element.colorClass}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="progress-meta">
                                            {element.value} ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
};

export default Statistics;
