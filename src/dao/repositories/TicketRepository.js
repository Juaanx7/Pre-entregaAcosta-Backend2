import TicketManager from "../managers/TicketManager.js";

export default class TicketRepository {
  constructor() {
    this.manager = new TicketManager();
  }

  createTicket(data) {
    return this.manager.create(data);
  }

  getAllTickets() {
    return this.manager.getAll();
  }

  getTicketByCode(code) {
    return this.manager.getByCode(code);
  }
}