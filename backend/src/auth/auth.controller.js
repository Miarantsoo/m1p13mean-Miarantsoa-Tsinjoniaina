import User from '../admin/user/user.model.js';
import Shop from '../admin/shop/shop.model.js';
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
        message: 'Email and password required.'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Account disabled. Contact administrator.'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials.'
      });
    }

    await user.updateLastLogin();

    const accessToken = await generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = await generateRefreshToken({
      userId: user._id.toString()
    });

    setRefreshTokenCookie(res, refreshToken);

    const shop = await Shop.findOne({ owner: user._id });

    res.json({
      message: 'Login successful',
      accessToken,
      user: user.toPublicJSON(),
      shop: shop || null
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
    const data = req.body;
    console.log(data)

    if (!data.email || !data.password || !data.first_name) {
      return res.status(400).json({
        message: 'All fields are required.'
      });
    }

    if (data.password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long.'
      });
    }

    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already exists.'
      });
    }

    const user = await User.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      role: data.role,
      provider: 'local'
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
      message: 'Registration successful',
      accessToken,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
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
        message: 'Refresh token missing.'
      });
    }

    const payload = await verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.userId);

    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
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
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Refresh error:', error);
    clearRefreshTokenCookie(res);
    res.status(401).json({
      message: 'Invalid refresh token or expired.',
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    clearRefreshTokenCookie(res);

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
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
        message: 'User not found.'
      });
    }

    // Chercher la boutique dont ce user est le manager (null si aucune)
    const shop = await Shop.findOne({ owner: user._id });

    res.json({
      user,
      shop: shop || null
    });

  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message
    });
  }
};
