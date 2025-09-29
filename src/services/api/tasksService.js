import { toast } from "react-toastify"

const tasksService = {
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
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords('task_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
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
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ]
      }

      const response = await apperClient.getRecordById('task_c', id, params)
      
      if (!response?.data) {
        throw new Error(`Task with ID ${id} not found`)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async create(taskData) {
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
          Name: taskData.Name || `Task for Room ${taskData.room_number_c || taskData.roomNumber}`,
          room_id_c: taskData.room_id_c || taskData.roomId,
          room_number_c: taskData.room_number_c || taskData.roomNumber,
          assigned_to_c: taskData.assigned_to_c || taskData.assignedTo,
          type_c: taskData.type_c || taskData.type,
          priority_c: taskData.priority_c || taskData.priority || "Medium",
          status_c: taskData.status_c || taskData.status || "Pending",
          description_c: taskData.description_c || taskData.description,
          created_at_c: taskData.created_at_c || taskData.createdAt || new Date().toISOString(),
          completed_at_c: taskData.completed_at_c || taskData.completedAt
        }]
      }

      const response = await apperClient.createRecord('task_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return successful[0].data
        }
      }

      throw new Error("Failed to create task")
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, taskData) {
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
          Name: taskData.Name || `Task for Room ${taskData.room_number_c || taskData.roomNumber}`,
          room_id_c: taskData.room_id_c || taskData.roomId,
          room_number_c: taskData.room_number_c || taskData.roomNumber,
          assigned_to_c: taskData.assigned_to_c || taskData.assignedTo,
          type_c: taskData.type_c || taskData.type,
          priority_c: taskData.priority_c || taskData.priority,
          status_c: taskData.status_c || taskData.status,
          description_c: taskData.description_c || taskData.description,
          created_at_c: taskData.created_at_c || taskData.createdAt,
          completed_at_c: taskData.completed_at_c || taskData.completedAt
        }]
      }

      const response = await apperClient.updateRecord('task_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return successful[0].data
        }
      }

      throw new Error("Failed to update task")
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
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

      const response = await apperClient.deleteRecord('task_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      return false
    }
  }
}

export default tasksService

export default tasksService