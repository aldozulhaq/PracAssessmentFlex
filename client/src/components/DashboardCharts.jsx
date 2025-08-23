import React from 'react';
import {
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';

const getRatingColorClass = (rating) => {
  if (rating >= 9) return '#16a34a'; // green-600
  if (rating >= 7) return '#65a30d'; // lime-600
  if (rating >= 5) return '#ca8a04'; // yellow-600
  if (rating >= 3) return '#ea580c'; // orange-600
  return '#dc2626'; // red-600
};

const formatLabel = (label) => {
  return label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

const truncateLabel = (label, maxLength = 10) => {
  if (label.length <= maxLength) return label;
  return `${label.substring(0, maxLength)}...`;
};

const ChartContainer = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-subtle border border-gray-100 h-96">
        <h3 className="font-semibold text-flex-dark-green mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height="90%">
            {children}
        </ResponsiveContainer>
    </div>
);

const DashboardCharts = ({ chartData }) => {
  const { timeSeriesData, propertyPerformanceData, subRatingData } = chartData;

  const formattedPropertyData = propertyPerformanceData.map(item => ({
    ...item,
    fullName: item.name,
    name: truncateLabel(item.name, 10),
  }));


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="lg:col-span-2">
        <ChartContainer title="Monthly Review Volume & Average Rating">
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" label={{ value: 'Reviews', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} label={{ value: 'Avg Rating', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="reviews" stroke="#8884d8" name="Reviews" />
            <Line yAxisId="right" type="monotone" dataKey="averageRating" stroke="#82ca9d" name="Avg Rating" />
          </LineChart>
        </ChartContainer>
      </div>

      <ChartContainer title="Average Rating by Property">
        <BarChart data={formattedPropertyData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 10]} />
          <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: 'rgba(240, 240, 240, 0.5)' }}
            labelFormatter={(label, payload) => {
              return payload[0]?.payload?.fullName || label;
            }} 
            formatter={(value) => [`${value.toFixed(1)} / 10`, 'Avg Rating']}
          />

          <Legend />
          <ReferenceLine x={8.5} stroke="red" label="Goal" />
          <Bar dataKey="averageRating" name="Avg Rating">
            {formattedPropertyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRatingColorClass(entry.averageRating)} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      <ChartContainer title="Sub-Rating Analysis">
        <RadarChart data={subRatingData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tickFormatter={formatLabel} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} />
          <Tooltip />
          <Radar name="Average Score" dataKey="A" stroke="#334D4C" fill="#334D4C" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ChartContainer>
    </div>
  );
};

export default DashboardCharts;