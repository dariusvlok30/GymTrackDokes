'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface WeightChartProps {
  data: { date: string; weight: number }[]
}

export function WeightChart({ data }: WeightChartProps) {
  const formatted = data.map(d => ({
    ...d,
    label: format(new Date(d.date), 'MMM d'),
  }))

  const min = Math.min(...data.map(d => d.weight))
  const max = Math.max(...data.map(d => d.weight))
  const padding = 1

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
        <XAxis
          dataKey="label"
          tick={{ fill: 'hsl(0 0% 44%)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[min - padding, max + padding]}
          tick={{ fill: 'hsl(0 0% 44%)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}kg`}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(0 0% 7%)',
            border: '1px solid hsl(0 0% 14%)',
            borderRadius: '8px',
            fontSize: 12,
          }}
          labelStyle={{ color: 'hsl(0 0% 96%)' }}
          formatter={(value: number) => [`${value} kg`, 'Weight']}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="hsl(142 71% 45%)"
          strokeWidth={2}
          dot={{ fill: 'hsl(142 71% 45%)', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: 'hsl(142 71% 45%)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
