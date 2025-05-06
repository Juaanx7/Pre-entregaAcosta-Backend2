import Ticket from "../dao/models/Ticket.js";

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ purchase_datetime: -1 }).lean();
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tickets", error: error.message });
  }
};