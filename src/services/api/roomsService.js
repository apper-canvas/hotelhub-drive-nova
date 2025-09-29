import { toast } from "react-toastify"

const roomsService = {
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
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "photos_c"}}
        ],
        orderBy: [{"fieldName": "number_c", "sorttype": "ASC"}]
      }

      const response = await apperClient.fetchRecords('room_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data
    } catch (error) {
      console.error("Error fetching rooms:", error?.response?.data?.message || error)
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
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "photos_c"}}
        ]
      }

      const response = await apperClient.getRecordById('room_c', id, params)
      
      if (!response?.data) {
        throw new Error(`Room with ID ${id} not found`)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching room ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async create(roomData) {
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
          Name: `Room ${roomData.number_c || roomData.number}`,
          number_c: roomData.number_c || roomData.number,
          type_c: roomData.type_c || roomData.type,
          capacity_c: roomData.capacity_c || roomData.capacity,
          amenities_c: roomData.amenities_c || (Array.isArray(roomData.amenities) ? roomData.amenities.join(', ') : roomData.amenities),
          status_c: roomData.status_c || roomData.status || "Available",
          price_per_night_c: roomData.price_per_night_c || roomData.pricePerNight,
          photos_c: roomData.photos_c || roomData.photos
        }]
      }

      const response = await apperClient.createRecord('room_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} rooms:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return successful[0].data
        }
      }

      throw new Error("Failed to create room")
    } catch (error) {
      console.error("Error creating room:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, roomData) {
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
          Name: roomData.Name || `Room ${roomData.number_c || roomData.number}`,
          number_c: roomData.number_c || roomData.number,
          type_c: roomData.type_c || roomData.type,
          capacity_c: roomData.capacity_c || roomData.capacity,
          amenities_c: roomData.amenities_c || (Array.isArray(roomData.amenities) ? roomData.amenities.join(', ') : roomData.amenities),
          status_c: roomData.status_c || roomData.status,
          price_per_night_c: roomData.price_per_night_c || roomData.pricePerNight,
          photos_c: roomData.photos_c || roomData.photos
        }]
      }

      const response = await apperClient.updateRecord('room_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} rooms:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return successful[0].data
        }
      }

      throw new Error("Failed to update room")
    } catch (error) {
      console.error("Error updating room:", error?.response?.data?.message || error)
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

      const response = await apperClient.deleteRecord('room_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} rooms:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting room:", error?.response?.data?.message || error)
      return false
    }
  }
}

export default roomsService

export default roomsService