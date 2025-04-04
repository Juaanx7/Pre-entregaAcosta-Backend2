import Ticket from "../models/Ticket.js";

export default class TicketManager {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getAll() {
    return await Ticket.find().lean();
  }

  async getByCode(code) {
    return await Ticket.findOne({ code }).lean();
  }
}