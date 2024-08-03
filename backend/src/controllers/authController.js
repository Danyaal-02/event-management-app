import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import User from '../models/User.js';
import Session from '../models/Session.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) throw error;

    const newUser = new User({ email, supabaseId: data.user.id });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    const dbUser = await User.findOne({ supabaseId: data.user.id });
    if (!dbUser) throw new Error('User not found in database');

    await Session.updateMany(
      { userId: dbUser._id, logoutTime: { $exists: false } },
      { $set: { logoutTime: new Date() } }
    );

    const session = new Session({
      userId: dbUser._id,
      ipAddress: req.ip,
      loginTime: new Date(),
      lastActivity: new Date()
    });
    await session.save();

    res.status(200).json({ 
      message: 'Login successful', 
      userId: dbUser._id,
      sessionId: session._id,
      token: data.session.access_token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { sessionId } = req.body;
    await Session.findByIdAndUpdate(sessionId, { logoutTime: new Date() });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};