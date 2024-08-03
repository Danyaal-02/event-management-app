import Event from '../models/Event.js';
import weatherService from '../services/weatherService.js';

export const createEvent = async (req, res) => {
  try {
    const { name, date, location, description } = req.body;
    const newEvent = new Event({
      name,
      date,
      location,
      description,
      userId: req.user.id,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id });
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, location, description } = req.body;
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name, date, location, description },
      { new: true }
    );
    if (!updatedEvent) throw new Error('Event not found or unauthorized');
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedEvent) throw new Error('Event not found or unauthorized');
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getWeather = async (req, res) => {
  try {
    const { location } = req.params;
    const weather = await weatherService.getWeather(location);
    res.status(200).json(weather);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};