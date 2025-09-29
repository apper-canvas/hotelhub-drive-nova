import { toast } from "react-toastify"

const bookingsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "guest_id_c"}},
          {"field": {"Name": "guest_name_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "booking_source_c"}},
          {"field": {"Name": "payment_method_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords('booking_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data
    } catch (error) {
      console.error("Error fetching bookings:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "guest_id_c"}},
          {"field": {"Name": "guest_name_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "booking_source_c"}},
          {"field": {"Name": "payment_method_c"}}
        ]
      }

      const response = await apperClient.getRecordById('booking_c', id, params)
      
      if (!response?.data) {
        throw new Error(`Booking with ID ${id} not found`)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async create(bookingData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Name: bookingData.guestName || bookingData.Name,
          guest_id_c: bookingData.guestId || bookingData.guest_id_c,
          guest_name_c: bookingData.guestName || bookingData.guest_name_c,
          room_id_c: bookingData.roomId || bookingData.room_id_c,
          room_number_c: bookingData.roomNumber || bookingData.room_number_c,
          check_in_c: bookingData.checkIn || bookingData.check_in_c,
          check_out_c: bookingData.checkOut || bookingData.check_out_c,
          total_amount_c: bookingData.totalAmount || bookingData.total_amount_c,
          status_c: bookingData.status || bookingData.status_c || "Confirmed",
          special_requests_c: bookingData.specialRequests || bookingData.special_requests_c,
          booking_source_c: bookingData.bookingSource || bookingData.booking_source_c || "Direct",
          payment_method_c: bookingData.paymentMethod || bookingData.payment_method_c
        }]
      }

      const response = await apperClient.createRecord('booking_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} bookings:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return successful[0].data
        }
      }

      throw new Error("Failed to create booking")
    } catch (error) {
      console.error("Error creating booking:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, bookingData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: bookingData.guestName || bookingData.Name,
          guest_id_c: bookingData.guestId || bookingData.guest_id_c,
          guest_name_c: bookingData.guestName || bookingData.guest_name_c,
          room_id_c: bookingData.roomId || bookingData.room_id_c,
          room_number_c: bookingData.roomNumber || bookingData.room_number_c,
          check_in_c: bookingData.checkIn || bookingData.check_in_c,
          check_out_c: bookingData.checkOut || bookingData.check_out_c,
          total_amount_c: bookingData.totalAmount || bookingData.total_amount_c,
          status_c: bookingData.status || bookingData.status_c,
          special_requests_c: bookingData.specialRequests || bookingData.special_requests_c,
          booking_source_c: bookingData.bookingSource || bookingData.booking_source_c,
          payment_method_c: bookingData.paymentMethod || bookingData.payment_method_c
        }]
      }

      const response = await apperClient.updateRecord('booking_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} bookings:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return successful[0].data
        }
      }

      throw new Error("Failed to update booking")
    } catch (error) {
      console.error("Error updating booking:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [id]
      }

      const response = await apperClient.deleteRecord('booking_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} bookings:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting booking:", error?.response?.data?.message || error)
      return false
    }
  }
}

export default bookingsService

export default bookingsService