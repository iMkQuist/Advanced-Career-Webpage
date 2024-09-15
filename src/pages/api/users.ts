import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod'; // For validation

// Simulating a user database (use a real database in production)
let users = [{ id: 1, username: 'admin', email: 'admin@example.com', passwordHash: bcrypt.hashSync('password', 10) }];

// Zod schema for user data validation
const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  username: z.string().optional(),
});

// JWT secret key and expiration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = '1h';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        // Check if the request is for login or registration
        const isRegister = req.query.action === 'register';
        return isRegister ? await registerUser(req, res) : await loginUser(req, res);

      case 'GET':
        // Optionally, retrieve a list of users (only for admin)
        const usersWithoutPasswords = users.map(({ passwordHash, ...rest }) => rest);
        return res.status(200).json(usersWithoutPasswords);

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Function to handle user login
async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  const parsedData = userSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({ message: 'Invalid request data', errors: parsedData.error.errors });
  }

  const { email, password } = parsedData.data;
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

  return res.status(200).json({ message: 'Login successful', token, user: { id: user.id, email: user.email, username: user.username } });
}

// Function to handle user registration
async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  const parsedData = userSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({ message: 'Invalid request data', errors: parsedData.error.errors });
  }

  const { email, password, username } = parsedData.data;

  // Check if the email is already registered
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  // Hash the password and create a new user
  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = { id: users.length + 1, email, username: username || 'User', passwordHash };

  // Add the new user to the in-memory database
  users.push(newUser);

  // Create JWT token for the new user
  const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

  return res.status(201).json({ message: 'User registered successfully', token, user: { id: newUser.id, email: newUser.email, username: newUser.username } });
}
