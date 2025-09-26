import React, { useState } from "react"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const GuestBookingForm = ({ selectedRoom, checkIn, checkOut, onBookingComplete }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate booking creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase()
      
      toast.success("Booking confirmed successfully!")
      
      onBookingComplete({
        id: bookingId,
        guest: formData,
        room: selectedRoom,
        checkIn,
        checkOut
      })
    } catch (error) {
      toast.error("Failed to create booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  const totalAmount = selectedRoom?.pricePerNight * nights || 0

  return (
    <Card variant="elevated" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Booking</h2>
        <p className="text-slate-600">Please fill in your details to confirm your reservation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter your last name"
          />
        </div>

        <FormField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email address"
        />

        <FormField
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Enter your phone number"
        />

        <FormField
          label="Special Requests"
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          placeholder="Any special requests or preferences?"
        >
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400"
            placeholder="Any special requests or preferences?"
          />
        </FormField>

        {/* Booking Summary */}
        <Card variant="gradient" className="p-6 bg-gradient-to-r from-slate-50 to-white">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Room:</span>
              <span className="font-semibold">{selectedRoom?.type} - Room {selectedRoom?.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Check-in:</span>
              <span className="font-semibold">{new Date(checkIn).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Check-out:</span>
              <span className="font-semibold">{new Date(checkOut).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Nights:</span>
              <span className="font-semibold">{nights}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Rate per night:</span>
              <span className="font-semibold">${selectedRoom?.pricePerNight}</span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-slate-900">Total Amount:</span>
                <span className="text-2xl font-black text-gradient">${totalAmount}</span>
              </div>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
              Processing Booking...
            </>
          ) : (
            <>
              <ApperIcon name="CreditCard" size={20} className="mr-2" />
              Confirm Booking
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}

export default GuestBookingForm