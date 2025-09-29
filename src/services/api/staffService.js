// Staff data is handled through the profile_c table with role filtering
import profileService from "./profileService"

const staffService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      // Get all profiles and filter for staff roles
      const allProfiles = await profileService.getAll()
      return allProfiles.filter(profile => 
        ['STAFF', 'RECEPTION', 'MANAGER', 'ADMIN'].includes(profile.role_c)
      )
    } catch (error) {
      console.error("Error fetching staff:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    try {
      const profile = await profileService.getById(id)
      
      // Ensure the profile is a staff member
      if (!['STAFF', 'RECEPTION', 'MANAGER', 'ADMIN'].includes(profile.role_c)) {
        throw new Error(`Profile with ID ${id} is not a staff member`)
      }
      
      return profile
    } catch (error) {
      console.error(`Error fetching staff member ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async getByRole(role) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      return await profileService.getByRole(role)
    } catch (error) {
      console.error("Error fetching staff by role:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(memberData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      // Ensure the role is a staff role
      if (!['STAFF', 'RECEPTION', 'MANAGER', 'ADMIN'].includes(memberData.role_c || memberData.role)) {
        memberData.role_c = memberData.role || 'STAFF'
      }
      
      return await profileService.create(memberData)
    } catch (error) {
      console.error("Error creating staff member:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, memberData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    try {
      // Ensure the role remains a staff role
      if (memberData.role_c || memberData.role) {
        const role = memberData.role_c || memberData.role
        if (!['STAFF', 'RECEPTION', 'MANAGER', 'ADMIN'].includes(role)) {
          memberData.role_c = 'STAFF'
        }
      }
      
      return await profileService.update(id, memberData)
    } catch (error) {
      console.error("Error updating staff member:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      return await profileService.delete(id)
    } catch (error) {
      console.error("Error deleting staff member:", error?.response?.data?.message || error)
      return false
    }
  }
}

export default staffService

export default staffService