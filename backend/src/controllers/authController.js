import { hashPassword, signAccessToken, verifyPassword } from '../middleware/auth.js';
import { loginSchema, registerSchema } from '../middleware/validation.js';
import { createUser, findUserByEmail } from '../repositories/userRepository.js';
import { ApiError } from '../utils/errors.js';

export async function register(req, res, next) {
  try {
    const payload = registerSchema.parse(req.body);
    const passwordHash = await hashPassword(payload.password);

    try {
      await createUser(payload.email, passwordHash);
    } catch (err) {
      if (err.code === '23505') {
        throw new ApiError(409, 'Email is already registered');
      }
      throw err;
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await findUserByEmail(payload.email);

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isValid = await verifyPassword(payload.password, user.password_hash);
    if (!isValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    res.json({ access_token: signAccessToken(user) });
  } catch (err) {
    next(err);
  }
}