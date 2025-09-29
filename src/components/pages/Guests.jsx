import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Bookings from "@/components/pages/Bookings";
import Profile from "@/components/pages/Profile";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import GuestCard from "@/components/molecules/GuestCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import guestsData from "@/services/mockData/guests.json";
import staffData from "@/services/mockData/staff.json";
import bookingsData from "@/services/mockData/bookings.json";
import roomsData from "@/services/mockData/rooms.json";
import tasksData from "@/services/mockData/tasks.json";
import profilesData from "@/services/mockData/profiles.json";
import guestsService from "@/services/api/guestsService";

const Guests = () => {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGuest, setSelectedGuest] = useState(null)

  const loadGuests = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await guestsService.getAll()
      setGuests(data)
    } catch (err) {
      setError("Failed to load guests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGuests()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadGuests} />

const filteredGuests = guests.filter(guest => 
    `${guest.first_name_c || guest.firstName || ""} ${guest.last_name_c || guest.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (guest.email_c || guest.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (guest.phone_c || guest.phone || "").includes(searchTerm)
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Guest Management</h1>
          <p className="text-slate-600">Manage guest profiles and preferences</p>
        </div>
        <Button variant="primary" className="sm:w-auto w-full">
          <ApperIcon name="UserPlus" size={18} className="mr-2" />
          Add New Guest
        </Button>
      </div>

      {/* Search and Filters */}
      <Card variant="gradient" className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <FormField
              placeholder="Search guests by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-0"
            >
              <div className="relative">
                <ApperIcon name="Search" size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search guests by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400"
                />
              </div>
            </FormField>
          </div>
          <Button variant="outline">
            <ApperIcon name="Filter" size={18} className="mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Guests Grid */}
      {filteredGuests.length === 0 ? (
        <Empty
          title={guests.length === 0 ? "No guests found" : "No matching guests"}
          description={guests.length === 0 ? "Get started by adding guest profiles" : "Try adjusting your search criteria"}
          icon="Users"
          actionLabel={guests.length === 0 ? "Add Guest" : "Clear Search"}
          onAction={guests.length === 0 ? () => {} : () => setSearchTerm("")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <GuestCard 
              key={guest.Id} 
              guest={guest} 
              onClick={setSelectedGuest}
            />
          ))}
        </div>
      )}

      {/* Guest Details Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card variant="elevated" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
{selectedGuest.first_name_c || selectedGuest.firstName} {selectedGuest.last_name_c || selectedGuest.lastName}
                  </h2>
                  <p className="text-slate-600">{selectedGuest.email_c || selectedGuest.email}</p>
                </div>
                <button 
                  onClick={() => setSelectedGuest(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="First Name"
                        value={selectedGuest.first_name_c || selectedGuest.firstName}
                        readOnly
                      />
                      <FormField
                        label="Last Name"
                        value={selectedGuest.last_name_c || selectedGuest.lastName}
                        readOnly
                      />
                    </div>
                    <FormField
                      label="Email"
                      value={selectedGuest.email_c || selectedGuest.email}
                      readOnly
                    />
                    <FormField
                      label="Phone"
                      value={selectedGuest.phone_c || selectedGuest.phone}
                      readOnly
                    />
                  </div>
                  {/* Preferences */}
{(selectedGuest.preferences_c || selectedGuest.preferences) && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Preferences</h3>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-slate-700">{selectedGuest.preferences_c || selectedGuest.preferences}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Shield" size={20} className="text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-900">Account Status</p>
                        <p className="text-sm text-emerald-600">Active Guest</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {(selectedGuest.vip_status_c || selectedGuest.vipStatus) && (
                        <div className="flex items-center gap-2 text-amber-700">
                          <ApperIcon name="Crown" size={16} />
                          <span className="font-semibold">VIP Guest</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-slate-700">
                        <ApperIcon name="History" size={16} />
                        <span>{selectedGuest.stay_history_c || selectedGuest.stayHistory || "No history"}</span>
</div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Button variant="primary" className="w-full">
                      <ApperIcon name="Edit" size={18} className="mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ApperIcon name="Calendar" size={18} className="mr-2" />
                      View Bookings
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <ApperIcon name="MessageCircle" size={18} className="mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Guests