// src/components/AnalyticsDashboard.jsx
import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AnalyticsDashboard({ user }) {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.UniqueID) return;

      try {
        const q = query(collection(db, "ecoData"), where("UniqueID", "==", user.UniqueID));
        const querySnapshot = await getDocs(q);
        const result = querySnapshot.docs.map(doc => doc.data());
        setUserData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [user]);

  // Prepare data for charts
  const aggregateData = userData.length > 0
    ? userData.reduce(
        (acc, entry) => {
          acc.mobility += entry.Mobility?.Points || 0;
          acc.consumption += entry.Consumption?.Points || 0;
          acc.waste += (entry.Waste?.["Points from Donation"] || 0) + (entry.Waste?.["Points from Compost"] || 0);
          acc.energy += entry.Energy?.Points || 0;
          acc.water += entry.Water?.Points || 0;
          acc.community += entry.Community?.Points || 0;
          return acc;
        },
        { mobility: 0, consumption: 0, waste: 0, energy: 0, water: 0, community: 0 }
      )
    : { mobility: 0, consumption: 0, waste: 0, energy: 0, water: 0, community: 0 };

  const barChartData = [
    { name: 'Mobility', points: aggregateData.mobility },
    { name: 'Consumption', points: aggregateData.consumption },
    { name: 'Waste', points: aggregateData.waste },
    { name: 'Energy', points: aggregateData.energy },
    { name: 'Water', points: aggregateData.water },
    { name: 'Community', points: aggregateData.community },
  ];

  const pieChartData = Object.entries(aggregateData).map(([name, points]) => ({
    name,
    value: points,
  }));

  const COLORS = ['#06B6D4', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="flex flex-col h-full">
      {user ? (
        <>
          <div className="text-center mb-6">
            <h3 className="text-2xl holo-text">Analytics for {user.UniqueID}</h3>
          </div>
          {error ? (
            <p className="text-red-500 text-center mb-4">{error}</p>
          ) : userData.length > 0 ? (
            <div className="space-y-8 overflow-y-auto">
              <div>
                <h4 className="text-xl text-cyan-400 text-center mb-4">Points by Category (Bar Chart)</h4>
                <BarChart width={700} height={300} data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="#e0e0e0" />
                  <YAxis stroke="#e0e0e0" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(25, 25, 25, 0.9)', border: '1px solid rgba(6, 182, 212, 0.5)', color: '#e0e0e0' }} />
                  <Bar dataKey="points" fill="#06B6D4" barSize={30} />
                </BarChart>
              </div>
              <div>
                <h4 className="text-xl text-cyan-400 text-center mb-4">Points Distribution (Pie Chart)</h4>
                <PieChart width={700} height={300}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: '#e0e0e0' }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(25, 25, 25, 0.9)', border: '1px solid rgba(6, 182, 212, 0.5)', color: '#e0e0e0' }} />
                  <Legend wrapperStyle={{ color: '#e0e0e0' }} />
                </PieChart>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400">No activity data available.</p>
          )}
        </>
      ) : (
        <p className="text-center text-gray-400">Please sign in to view analytics.</p>
      )}
    </div>
  );
}