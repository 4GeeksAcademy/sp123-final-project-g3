import "../index.css";
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

const Statistics = () => {
    const pieData = {
        labels: ["To apply", "Applied", "Interview", "Offer", "Rejected"],
        datasets: [
            {
                data: [4, 4, 3, 2, 2],
                backgroundColor: [
                    "#6b6b6b",
                    "#21616a",
                    "#d48a2a",
                    "#2e9ca0",
                    "#533946",
                ],
                borderWidth: 0,
            },
        ],
    };

    const total = pieData.datasets[0].data.reduce((accumulator, number) => accumulator + number, 0);

    const progressElements = [
        { key: "To apply", value: pieData.datasets[0].data[0], colorClass: "is-gray" },
        { key: "Applied", value: pieData.datasets[0].data[1], colorClass: "is-teal" },
        { key: "Interview", value: pieData.datasets[0].data[2], colorClass: "is-orange" },
        { key: "Offer", value: pieData.datasets[0].data[3], colorClass: "is-blue" },
        { key: "Rejected", value: pieData.datasets[0].data[4], colorClass: "is-purple" },
    ];

    const barData = {
        labels: ["StartupXYZ", "InnovateTech", "CloudSystems"],
        datasets: [
            {
                label: "Postulations",
                data: [2, 1, 1],
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
                            <h3 className="kpi-value">15</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Interview Rate</p>
                            <h3 className="kpi-value">75%</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-file-earmark-text-fill"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Offer Rate</p>
                            <h3 className="kpi-value">67%</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-clock-history"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Average Response Time</p>
                            <h3 className="kpi-value">7 days</h3>
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
