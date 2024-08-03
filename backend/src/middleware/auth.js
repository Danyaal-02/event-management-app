import supabase from '../services/supabaseService.js';
import User from '../models/User.js';
import Session from '../models/Session.js';

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error('No authorization header');

    const token = authorization.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error) throw error;

    const user = await User.findOne({ supabaseId: data.user.id });
    if (!user) throw new Error('User not found in database');

    const session = await Session.findOne({
      userId: user._id,
      logoutTime: { $exists: false }
    }).sort({ loginTime: -1 });

    if (!session) throw new Error('No active session found');

    session.lastActivity = new Date();
    await session.save();

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authMiddleware;