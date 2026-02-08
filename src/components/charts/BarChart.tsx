"use client"

import React from "react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { cx } from "../../utils/utils"

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: any[]
    category: string
    index: string
    colors?: string[]
    valueFormatter?: (value: number) => string
    layout?: 'horizontal' | 'vertical'
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
    ({ data, category, index, colors = [], valueFormatter, layout = 'vertical', className, ...props }, ref) => {

        // Default colors
        const categoryColors = colors.length > 0 ? colors : [
            "#3b82f6", // blue-500
            "#ef4444", // red-500
            "#f59e0b", // amber-500
            "#10b981", // emerald-500
            "#8b5cf6", // violet-500
            "#06b6d4", // cyan-500
        ];

        return (
            <div ref={ref} className={cx("w-full h-64", className)} {...props}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                        data={data.map((entry, index) => ({
                            ...entry,
                            fill: categoryColors[index % categoryColors.length],
                        }))}
                        layout={layout}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                        {layout === 'vertical' ? (
                            <>
                                <XAxis type="number" stroke="#9ca3af" />
                                <YAxis dataKey={index} type="category" stroke="#9ca3af" width={100} />
                            </>
                        ) : (
                            <>
                                <XAxis dataKey={index} stroke="#9ca3af" />
                                <YAxis type="number" stroke="#9ca3af" />
                            </>
                        )}
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm text-sm">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: payload[0].fill }}
                                                />
                                                <span className="text-gray-700 font-medium">
                                                    {payload[0].payload[index]}
                                                </span>
                                            </div>
                                            <p className="font-bold text-gray-900">
                                                {valueFormatter
                                                    ? valueFormatter(payload[0].value as number)
                                                    : payload[0].value}
                                            </p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar
                            dataKey={category}
                            radius={[4, 4, 4, 4]}
                        />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        )
    }
)

BarChart.displayName = "BarChart"

export { BarChart }
