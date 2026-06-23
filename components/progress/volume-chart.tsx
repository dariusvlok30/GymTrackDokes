'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface VolumeChartProps {
  data: { week: string; volume: number }[]
}

export function VolumeChart({ data }: VolumeChartProps) {
  const formatted = data.map(d => ({
    ...d,
    label: format(new Date(d.week), 'MMM d'),
    volume: Math.round(d.volume),
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'hsl(0 0% 44%)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: 'hsl(0 0% 44%)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(0 0% 7%)',
            border: '1px solid hsl(0 0% 14%)',
            borderRadius: '8px',
            fontSize: 12,
          }}
          labelStyle={{ color: 'hsl(0 0% 96%)' }}
          formatter={(value: number) => [`${value.toLocaleString()} kg`, 'Volume']}
        />
        <Bar
          dataKey="volume"
          fill="hsl(142 71% 45%)"
          radius={[4, 4, 0, 0]}
          fillOpacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
