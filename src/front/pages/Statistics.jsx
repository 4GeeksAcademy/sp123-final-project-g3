import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Briefcase,
  Calendar,
  Award,
} from "lucide-react";
import { Card } from "../components/ui/Card";

const STATUS_COLORS = {
  interested: "#6B7280",
  applied: "#21616A",
  interview: "#EFA00F",
  offer: "#2E9CA0",
  rejected: "#533946",
};

const STATUS_LABELS = {
  interested: "Por Aplicar",
  applied: "Aplicado",
  interview: "Entrevista",
  offer: "Oferta",
  rejected: "Rechazado",
};

export function StatisticsView({ stats }) {
  const statusData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: STATUS_LABELS[status],
    value: count,
    color: STATUS_COLORS[status],
  }));

  const statCards = [
    {
      title: "Total de Postulaciones",
      value: stats.totalApplications,
      icon: Briefcase,
      color: "text-[#0F2C33]",
      bgColor: "bg-[#E6D1B4]",
    },
    {
      title: "Tasa de Entrevistas",
      value: `${stats.interviewRate}%`,
      icon: TrendingUp,
      color: "text-[#EFA00F]",
      bgColor: "bg-amber-50",
    },
    {
      title: "Tasa de Ofertas",
      value: `${stats.offerRate}%`,
      icon: Award,
      color: "text-[#2E9CA0]",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Tiempo Promedio de Respuesta",
      value: `${stats.avgResponseTime} días`,
      icon: Calendar,
      color: "text-[#533946]",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#374151]">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#374151] mb-4">
            Distribución por Estado
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Companies */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#374151] mb-4">
            Empresas con más postulaciones
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topCompanies}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="company" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#21616A"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Status Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#374151] mb-4">
          Detalle de Postulaciones
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const percentage =
              stats.totalApplications > 0
                ? ((count / stats.totalApplications) * 100).toFixed(1)
                : 0;

            return (
              <div key={status} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-[#374151]">
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="text-sm text-[#6B7280]">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: STATUS_COLORS[status],
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
