import guestsData from "@/services/mockData/guests.json"

const guestsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...guestsData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const guest = guestsData.find(guest => guest.Id === id)
    if (!guest) {
      throw new Error(`Guest with ID ${id} not found`)
    }
    return { ...guest }
  },

  async create(guestData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...guestsData.map(guest => guest.Id)) + 1
    const newGuest = { ...guestData, Id: newId }
    guestsData.push(newGuest)
    return { ...newGuest }
  },

  async update(id, guestData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = guestsData.findIndex(guest => guest.Id === id)
    if (index === -1) {
      throw new Error(`Guest with ID ${id} not found`)
    }
    guestsData[index] = { ...guestData, Id: id }
    return { ...guestsData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = guestsData.findIndex(guest => guest.Id === id)
    if (index === -1) {
      throw new Error(`Guest with ID ${id} not found`)
    }
    guestsData.splice(index, 1)
    return true
  }
}

export default guestsService