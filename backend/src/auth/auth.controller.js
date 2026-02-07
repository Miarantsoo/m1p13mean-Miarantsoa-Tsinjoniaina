import User from '../admin/user/user.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  verifyRefreshToken
} from '../middleware/auth.middleware.js';


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required.'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const bcrypt = await import('bcrypt');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const accessToken = await generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user'
    });

    const refreshToken = await generateRefreshToken({
      userId: user._id.toString()
    });

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role || 'user',
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error during login',
      error: error.message
    });
  }
};


export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation des champs
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis.'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists.'
      });
    }

    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user' // rôle par défaut
    });


    const accessToken = await generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = await generateRefreshToken({
      userId: user._id.toString()
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};


export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing.'
      });
    }

    const payload = await verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.userId);

    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    const newAccessToken = await generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user'
    });

    const newRefreshToken = await generateRefreshToken({
      userId: user._id.toString()
    });

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Refresh error:', error);
    clearRefreshTokenCookie(res);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token or expired.',
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    clearRefreshTokenCookie(res);

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};
