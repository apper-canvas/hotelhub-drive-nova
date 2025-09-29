// Note: No guest_c table available in database schema
// Using mock service layer with JSON storage until database table is created

const mockGuests = [
  {
    Id: 1,
    first_name_c: "John",
    last_name_c: "Smith",
    email_c: "john.smith@email.com",
    phone_c: "+1-555-0101",
    vip_status_c: true,
    preferences_c: "Non-smoking room, late checkout",
    stay_history_c: "3 previous stays"
  },
  {
    Id: 2,
    first_name_c: "Sarah",
    last_name_c: "Johnson",
    email_c: "sarah.johnson@email.com",
    phone_c: "+1-555-0102",
    vip_status_c: false,
    preferences_c: "Ground floor room, early checkin",
    stay_history_c: "1 previous stay"
  },
  {
    Id: 3,
    first_name_c: "Michael",
    last_name_c: "Davis",
    email_c: "michael.davis@email.com",
    phone_c: "+1-555-0103",
    vip_status_c: true,
    preferences_c: "High floor, city view, spa services",
    stay_history_c: "5 previous stays"
  },
  {
    Id: 4,
    first_name_c: "Emily",
    last_name_c: "Wilson",
    email_c: "emily.wilson@email.com",
    phone_c: "+1-555-0104",
    vip_status_c: false,
    preferences_c: "Quiet room, away from elevators",
    stay_history_c: "2 previous stays"
  },
  {
    Id: 5,
    first_name_c: "David",
    last_name_c: "Brown",
    email_c: "david.brown@email.com",
    phone_c: "+1-555-0105",
    vip_status_c: false,
    preferences_c: "Business center access, early breakfast",
    stay_history_c: "1 previous stay"
  }
]

const guestsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockGuests]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const guest = mockGuests.find(guest => guest.Id === parseInt(id))
    if (!guest) {
      throw new Error(`Guest with ID ${id} not found`)
    }
    return { ...guest }
  },

  async create(guestData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...mockGuests.map(guest => guest.Id)) + 1
    const newGuest = { 
      ...guestData, 
      Id: newId
    }
    mockGuests.push(newGuest)
    return { ...newGuest }
  },

  async update(id, guestData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockGuests.findIndex(guest => guest.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Guest with ID ${id} not found`)
    }
    mockGuests[index] = { ...guestData, Id: parseInt(id) }
    return { ...mockGuests[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockGuests.findIndex(guest => guest.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Guest with ID ${id} not found`)
    }
    mockGuests.splice(index, 1)
    return true
  }
}

export default guestsService
