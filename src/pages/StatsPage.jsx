import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAuth } from "../Auth/AuthContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function StatsPage() {
  const { fetchWithAuth } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/orders/stats/`,
          {},
          true
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Erreur API ${res.status}: ${errText}`);
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Erreur chargement stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [fetchWithAuth]);

  if (loading) return <p>Chargement des statistiques...</p>;
  if (error) return <p className="text-red-500">Erreur: {error}</p>;
  if (!stats) return <p>Aucune donnée disponible.</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Statistiques des ventes</h1>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Offre</th>
              <th className="border px-4 py-2">Tickets vendus</th>
              <th className="border px-4 py-2">Chiffre d'affaires (€)</th>
            </tr>
          </thead>
          <tbody>
            {stats.offers.map((offer, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{offer["offer__nom"]}</td>
                <td className="border px-4 py-2">{offer.total_tickets}</td>
                <td className="border px-4 py-2">{offer.total_revenue}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-100">
              <td className="border px-4 py-2">TOTAL</td>
              <td className="border px-4 py-2">{stats.global.total_tickets}</td>
              <td className="border px-4 py-2">{stats.global.total_revenue}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Camembert */}
      <div className="flex justify-center">
        <div style={{ width: "600px", height: "400px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={stats.offers}
                dataKey="total_tickets" 
                nameKey="offer__nom"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {stats.offers.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
