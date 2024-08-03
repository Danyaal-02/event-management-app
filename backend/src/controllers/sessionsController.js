import Session from '../models/Session.js';

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ loginTime: -1 }); 
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentSession = (req, res) => {
  res.status(200).json(req.session);
};