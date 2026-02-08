"use client"

import React from "react"
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts"
import { cx } from "../../utils/utils" // Asegúrate de importar tu función cx

interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: any[]
    category: string
    index: string
    colors?: string[]
    valueFormatter?: (value: number) => string
    showLabel?: boolean
    onSegmentClick?: (data: any, index: number) => void
    centerText?: string
    centerSubtext?: string
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
    ({
        data,
        category,
        index,
        colors = [],
        valueFormatter,
        className,
        showLabel = true,
        onSegmentClick,
        centerText,
        centerSubtext,
        ...props
    }, ref) => {


        // Mapeo de colores de Tailwind (puedes agregar más)
        const categoryColors = colors.length > 0 ? colors : [
            "#3b82f6", // blue-500
            "#ef4444", // red-500
            "#f59e0b", // amber-500
            "#10b981", // emerald-500
            "#8b5cf6", // violet-500
            "#06b6d4", // cyan-500
            "#ec4899", // pink-500
            "#86efac", // green-300
            "#fca5a5", // red-300
            "#facc15", // yellow-300
            "#a78bfa", // violet-300
            "#93c5fd", // blue-300
        ];

        const handleClick = (entry: any, index: number) => {
            if (onSegmentClick) {
                onSegmentClick(entry, index);
            }
        };

        return (
            <div ref={ref} className={cx("w-full h-40 relative min-w-0 donut-chart-hover-effect", className)} {...props}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <RechartsPieChart>
                        <Pie
                            data={data.map((entry, index) => ({
                                ...entry,
                                fill: categoryColors[index % categoryColors.length],
                            }))}
                            cx="50%"
                            cy="50%"
                            startAngle={90}
                            endAngle={-270}
                            innerRadius="60%"
                            outerRadius="100%"
                            paddingAngle={3}
                            dataKey={category}
                            nameKey={index}
                            stroke="none"
                            onClick={handleClick}
                            style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm text-sm">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: payload[0].payload.fill }}
                                                />
                                                <span className="text-gray-500">
                                                    {payload[0].name}
                                                </span>
                                            </div>
                                            <p className="font-medium text-gray-900 mt-1">
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
                    </RechartsPieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                {(centerText || centerSubtext) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        {centerText && (
                            <div className="text-2xl font-bold text-gray-900">
                                {centerText}
                            </div>
                        )}
                        {centerSubtext && (
                            <div className="text-xs text-gray-500 mt-1">
                                {centerSubtext}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
)

DonutChart.displayName = "DonutChart"

export { DonutChart }
