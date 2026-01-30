import "../index.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
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
        datasets: [{
            data: [4, 4, 3, 2, 2],
            backgroundColor: [
                "#6b6b6b",
                "#21616a",
                "#d48a2a",
                "#2e9ca0",
                "#533946",],
            borderWidth: 0,},
        ],
    };

    const barData = {
        labels: ["StartupXYZ", "InnovateTech", "CloudSystems"],
        datasets: [{
            label: "Postulaciones",
            data: [2, 1, 1],
            backgroundColor: "#21616a",
            borderRadius: 6,},
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
                {/* TOP KPI CARDS */}
                <div className="kpi-grid">
                    <article className="kpi-card">
                        <div className="kpi-icon">🏢</div>
                        <div className="kpi-content">
                            <p className="kpi-label">Total de Postulaciones</p>
                            <h3 className="kpi-value">15</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">📈</div>
                        <div className="kpi-content">
                            <p className="kpi-label">Tasa de Entrevistas</p>
                            <h3 className="kpi-value">75%</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">🧾</div>
                        <div className="kpi-content">
                            <p className="kpi-label">Tasa de Ofertas</p>
                            <h3 className="kpi-value">67%</h3>
                        </div>
                    </article>

                    <article className="kpi-card">
                        <div className="kpi-icon">📅</div>
                        <div className="kpi-content">
                            <p className="kpi-label">Tiempo Promedio de Respuesta</p>
                            <h3 className="kpi-value">7 días</h3>
                        </div>
                    </article>
                </div>

                {/* MIDDLE ROW (2 LARGE CARDS) */}
                <div className="dashboard-grid-2">
                    <section className="panel-card">
                        <header className="panel-header">
                            <h4 className="panel-title">Distribución por Estado</h4>
                        </header>

                        <div className="panel-body">
                            {/* Placeholder gráfico circular */}
                            <div className="chart-placeholder chart-pie">
                                <Pie data={pieData} options={chartOptions} />
                                {/* Ej: <canvas id="statusPie"></canvas> */}
                            </div>
                        </div>
                    </section>

                    <section className="panel-card">
                        <header className="panel-header">
                            <h4 className="panel-title">Empresas con más postulaciones</h4>
                        </header>

                        <div className="panel-body">
                            {/* Placeholder gráfico de barras */}
                            <div className="chart-placeholder chart-bar">
                                <Bar data={barData} options={chartOptions} />
                                {/* Ej: <canvas id="companiesBar"></canvas> */}
                            </div>
                        </div>
                    </section>
                </div>

                {/* BOTTOM LARGE CARD */}
                <section className="panel-card panel-full">
                    <header className="panel-header">
                        <h4 className="panel-title">Detalle de Postulaciones</h4>
                    </header>

                    <div className="panel-body">
                        <div className="progress-list">
                            <div className="progress-row">
                                <span className="progress-label">Por Aplicar</span>
                                <div className="progress-track">
                                    <div className="progress-fill is-gray" style={{ width: "26.7%" }}></div>
                                </div>
                                <span className="progress-meta">4 (26.7%)</span>
                            </div>

                            <div className="progress-row">
                                <span className="progress-label">Aplicado</span>
                                <div className="progress-track">
                                    <div className="progress-fill is-teal" style={{ width: "26.7%" }}></div>
                                </div>
                                <span className="progress-meta">4 (26.7%)</span>
                            </div>

                            <div className="progress-row">
                                <span className="progress-label">Entrevista</span>
                                <div className="progress-track">
                                    <div className="progress-fill is-orange" style={{ width: "20%" }}></div>
                                </div>
                                <span className="progress-meta">3 (20%)</span>
                            </div>

                            <div className="progress-row">
                                <span className="progress-label">Oferta</span>
                                <div className="progress-track">
                                    <div className="progress-fill is-blue" style={{ width: "13.3%" }}></div>
                                </div>
                                <span className="progress-meta">2 (13.3%)</span>
                            </div>

                            <div className="progress-row">
                                <span className="progress-label">Rechazado</span>
                                <div className="progress-track">
                                    <div className="progress-fill is-purple" style={{ width: "13.3%" }}></div>
                                </div>
                                <span className="progress-meta">2 (13.3%)</span>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    )
}

export default Estadisticas

