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

const Estadisticas = () => {
    const pieData = {
        labels: ["Por aplicar", "Aplicado", "Entrevista", "Oferta", "Rechazado"],
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

    const total = pieData.datasets[0].data.reduce((acc, n) => acc + n, 0);

    const progressItems = [
        { key: "Por aplicar", value: pieData.datasets[0].data[0], colorClass: "is-gray" },
        { key: "Aplicado", value: pieData.datasets[0].data[1], colorClass: "is-teal" },
        { key: "Entrevista", value: pieData.datasets[0].data[2], colorClass: "is-orange" },
        { key: "Oferta", value: pieData.datasets[0].data[3], colorClass: "is-blue" },
        { key: "Rechazado", value: pieData.datasets[0].data[4], colorClass: "is-purple" },
    ];

    const barData = {
        labels: ["StartupXYZ", "InnovateTech", "CloudSystems"],
        datasets: [
            {
                label: "Postulaciones",
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
                            <p className="kpi-label">Total de Postulaciones</p>
                            <h3 className="kpi-value">15</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Tasa de Entrevistas</p>
                            <h3 className="kpi-value">75%</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-file-earmark-text-fill"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Tasa de Ofertas</p>
                            <h3 className="kpi-value">67%</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">
                            <i className="bi bi-clock-history"></i>
                        </div>
                        <div className="kpi-content">
                            <p className="kpi-label">Tiempo Promedio de Respuesta</p>
                            <h3 className="kpi-value">7 días</h3>
                        </div>
                    </article>
                </div>

                <div className="dashboard-grid-2">
                    <section className="panel-card">
                        <header className="panel-header">
                            <h4 className="panel-title">Distribución por Estado</h4>
                        </header>
                        <div className="panel-body">
                            <div className="chart-placeholder chart-pie">
                                <Pie data={pieData} options={chartOptions} />
                            </div>
                        </div>
                    </section>

                    <section className="panel-card">
                        <header className="panel-header">
                            <h4 className="panel-title">Empresas con más postulaciones</h4>
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
                        <h4 className="panel-title">Detalle de Postulaciones</h4>
                    </header>
                    <div className="panel-body">
                        <div className="progress-list">
                            {progressItems.map((item) => {
                                const pct = total === 0 ? 0 : (item.value / total) * 100;
                                return (
                                    <div className="progress-row" key={item.key}>
                                        <span className="progress-label">{item.key}</span>
                                        <div
                                            className="progress-track"
                                            aria-label={`${item.key} ${item.value}`}
                                        >
                                            <div
                                                className={`progress-fill ${item.colorClass}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="progress-meta">
                                            {item.value} ({pct.toFixed(1)}%)
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

export default Estadisticas;
