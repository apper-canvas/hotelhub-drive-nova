import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import StatsCard from "@/components/molecules/StatsCard"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import bookingsService from "@/services/api/bookingsService"
import roomsService from "@/services/api/roomsService"

const Reports = () => {
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dateRange, setDateRange] = useState("7")

  const loadReportsData = async () => {
    try {
      setError("")
      setLoading(true)
      const [bookingsData, roomsData] = await Promise.all([
        bookingsService.getAll(),
        roomsService.getAll()
      ])
      setBookings(bookingsData)
      setRooms(roomsData)
    } catch (err) {
      setError("Failed to load reports data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportsData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadReportsData} />

  // Calculate metrics
  const totalRevenue = bookings.reduce((sum, booking) => 
    booking.status !== "Cancelled" ? sum + booking.totalAmount : sum, 0
  )
  const occupancyRate = Math.round((rooms.filter(room => room.status === "Occupied").length / rooms.length) * 100)
  const avgRoomRate = Math.round(totalRevenue / bookings.filter(b => b.status !== "Cancelled").length) || 0
  const totalBookings = bookings.length

  // Chart data
  const revenueChartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      background: "transparent"
    },
    colors: ["#2563eb"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { colors: "#64748b", fontSize: "12px" } }
    },
    yaxis: {
      labels: { 
        style: { colors: "#64748b", fontSize: "12px" },
        formatter: (value) => `$${value}`
      }
    },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 3 },
    tooltip: {
      y: { formatter: (value) => `$${value}` }
    }
  }

  const revenueChartSeries = [{
    name: "Revenue",
    data: [3200, 4100, 3800, 5100, 4900, 6200, 5800]
  }]

  const occupancyChartOptions = {
    chart: {
      type: "donut",
      height: 300
    },
    colors: ["#059669", "#dc2626", "#f59e0b", "#64748b"],
    labels: ["Occupied", "Available", "Maintenance", "Other"],
    legend: {
      position: "bottom",
      labels: { colors: "#64748b" }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Rooms",
              color: "#1e293b",
              fontSize: "16px",
              fontWeight: 600
            }
          }
        }
      }
    },
    tooltip: {
      y: { formatter: (value) => `${value} rooms` }
    }
  }

  const occupiedRooms = rooms.filter(room => room.status === "Occupied").length
  const availableRooms = rooms.filter(room => room.status === "Available").length
  const maintenanceRooms = rooms.filter(room => room.status === "Maintenance").length
  const otherRooms = rooms.length - occupiedRooms - availableRooms - maintenanceRooms

  const occupancyChartSeries = [occupiedRooms, availableRooms, maintenanceRooms, otherRooms]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
          <p className="text-slate-600">Monitor hotel performance and key metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <Button variant="outline">
            <ApperIcon name="Download" size={18} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          color="success"
          trend="up"
          trendValue="+15%"
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon="Home"
          color="primary"
          trend="up"
          trendValue="+8%"
        />
        <StatsCard
          title="Avg Room Rate"
          value={`$${avgRoomRate}`}
          icon="TrendingUp"
          color="info"
          trend="up"
          trendValue="+5%"
        />
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          icon="Calendar"
          color="warning"
          trend="up"
          trendValue="+12%"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Revenue Trend</h2>
              <p className="text-sm text-slate-600">Daily revenue for the past week</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 text-white">
              <ApperIcon name="TrendingUp" size={20} />
            </div>
          </div>
          <Chart
            options={revenueChartOptions}
            series={revenueChartSeries}
            type="area"
            height={350}
          />
        </Card>

        {/* Occupancy Chart */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Room Occupancy</h2>
              <p className="text-sm text-slate-600">Current room status distribution</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-400 text-white">
              <ApperIcon name="PieChart" size={20} />
            </div>
          </div>
          <Chart
            options={occupancyChartOptions}
            series={occupancyChartSeries}
            type="donut"
            height={300}
          />
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Bookings</h2>
            <p className="text-sm text-slate-600">Latest reservation activity</p>
          </div>
          <Button variant="outline" size="sm">
            <ApperIcon name="ExternalLink" size={16} className="mr-2" />
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Booking ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Guest</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Room</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Check-in</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 8).map((booking) => (
                <tr key={booking.Id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">#{booking.Id}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{booking.guestName}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{booking.roomNumber}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-slate-900">
                    ${booking.totalAmount}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "Confirmed" 
                        ? "bg-emerald-100 text-emerald-700"
                        : booking.status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : booking.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Reports