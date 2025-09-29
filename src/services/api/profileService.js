import { toast } from "react-toastify"

const profileService = {
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "avatar_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "status_c"}}
        ],
        orderBy: [{"fieldName": "join_date_c", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords('profile_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data
    } catch (error) {
      console.error("Error fetching profiles:", error?.response?.data?.message || error)
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "avatar_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "status_c"}}
        ]
      }

      const response = await apperClient.getRecordById('profile_c', id, params)
      
      if (!response?.data) {
        throw new Error(`Profile with ID ${id} not found`)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching profile ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async getCurrentProfile() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    try {
      // Get first profile as current user for demo purposes
      const profiles = await this.getAll()
      if (profiles.length > 0) {
        return profiles[0]
      }
      
      // Return default profile if no profiles exist
      return {
        Id: 1,
        Name: "Admin User",
        first_name_c: "Admin",
        last_name_c: "User",
        email_c: "admin@hotelhubpro.com",
        phone_c: "+1-555-0100",
        role_c: "ADMIN",
        department_c: "Management",
        join_date_c: new Date().toISOString(),
        avatar_c: "",
        address_c: "123 Hotel Street, City, State",
        emergency_contact_c: "+1-555-0199",
        status_c: "Active"
      }
    } catch (error) {
      console.error("Error fetching current profile:", error?.response?.data?.message || error)
      throw error
    }
  },

  async getByRole(role) {
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "avatar_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{"FieldName": "role_c", "Operator": "EqualTo", "Values": [role]}]
      }

      const response = await apperClient.fetchRecords('profile_c', params)
      
      if (!response?.data?.length) {
        return []
      }
      
      return response.data
    } catch (error) {
      console.error("Error fetching profiles by role:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(profileData) {
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
          Name: `${profileData.first_name_c || profileData.firstName} ${profileData.last_name_c || profileData.lastName}`,
          first_name_c: profileData.first_name_c || profileData.firstName,
          last_name_c: profileData.last_name_c || profileData.lastName,
          email_c: profileData.email_c || profileData.email,
          phone_c: profileData.phone_c || profileData.phone,
          role_c: profileData.role_c || profileData.role || "STAFF",
          department_c: profileData.department_c || profileData.department,
          join_date_c: profileData.join_date_c || profileData.joinDate || new Date().toISOString(),
          avatar_c: profileData.avatar_c || profileData.avatar,
          address_c: profileData.address_c || profileData.address,
          emergency_contact_c: profileData.emergency_contact_c || profileData.emergencyContact,
          status_c: profileData.status_c || profileData.status || "Active"
        }]
      }

      const response = await apperClient.createRecord('profile_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} profiles:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return successful[0].data
        }
      }

      throw new Error("Failed to create profile")
    } catch (error) {
      console.error("Error creating profile:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, profileData) {
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
          Name: profileData.Name || `${profileData.first_name_c || profileData.firstName} ${profileData.last_name_c || profileData.lastName}`,
          first_name_c: profileData.first_name_c || profileData.firstName,
          last_name_c: profileData.last_name_c || profileData.lastName,
          email_c: profileData.email_c || profileData.email,
          phone_c: profileData.phone_c || profileData.phone,
          role_c: profileData.role_c || profileData.role,
          department_c: profileData.department_c || profileData.department,
          join_date_c: profileData.join_date_c || profileData.joinDate,
          avatar_c: profileData.avatar_c || profileData.avatar,
          address_c: profileData.address_c || profileData.address,
          emergency_contact_c: profileData.emergency_contact_c || profileData.emergencyContact,
          status_c: profileData.status_c || profileData.status
        }]
      }

      const response = await apperClient.updateRecord('profile_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} profiles:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return successful[0].data
        }
      }

      throw new Error("Failed to update profile")
    } catch (error) {
      console.error("Error updating profile:", error?.response?.data?.message || error)
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

      const response = await apperClient.deleteRecord('profile_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} profiles:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting profile:", error?.response?.data?.message || error)
      return false
    }
  },

  async updatePassword(id, oldPassword, newPassword) {
    await new Promise(resolve => setTimeout(resolve, 400))
    // Password updates would be handled through ApperUI authentication system
    // This is a placeholder for compatibility
    return true
  },

  _getPermissionsByRole(role) {
    const rolePermissions = {
      ADMIN: ["manage_users", "manage_bookings", "manage_rooms", "view_reports", "manage_billing", "system_admin"],
      MANAGER: ["manage_bookings", "manage_rooms", "view_reports", "manage_staff"],
      RECEPTION: ["manage_bookings", "view_guests", "basic_reports"],
      STAFF: ["view_tasks", "update_room_status", "update_maintenance_status"],
      GUEST: ["view_bookings", "manage_profile"]
    }
    return rolePermissions[role] || []
  },

  getRoleHierarchy() {
    return ["GUEST", "STAFF", "RECEPTION", "MANAGER", "ADMIN"]
  },

  getRolePermissions(role) {
    return this._getPermissionsByRole(role)
  }
}

export default profileService
