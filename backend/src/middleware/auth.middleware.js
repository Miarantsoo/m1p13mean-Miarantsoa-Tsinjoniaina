import {jwtVerify, SignJWT} from 'jose';

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sarotra-ny-lalana-mitondra-fiadanana'
);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sarotra-ny-lalana-mitondra-fiadanana'
);


const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRE_MINUTES + " minutes" || '15 minutes';
const REFRESH_TOKEN_EXPIRE_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRE_DAYS) || 7;
const maxAgeRefresh = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_EXPIRATION = REFRESH_TOKEN_EXPIRE_DAYS + ' days';


export const generateAccessToken = async (payload) => {
  return await new SignJWT(payload)
      .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
      .sign(ACCESS_TOKEN_SECRET);
};


export const generateRefreshToken = async (payload) => {
  return await new SignJWT(payload)
      .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
      .setIssuedAt()
      .setExpirationTime(REFRESH_TOKEN_EXPIRATION)
      .sign(REFRESH_TOKEN_SECRET);
};


export const verifyAccessToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};


export const verifyRefreshToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};


export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing. Sign in now.'
      });
    }

    const token = authHeader.substring(7);

    req.user = await verifyAccessToken(token);

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token or expired.',
      error: error.message
    });
  }
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * @param  {...string} roles - Les rôles autorisés
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};


export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: maxAgeRefresh,
    path: '/'
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
};

/**
 * Route/Controller helper pour rafraîchir les tokens
 * Exemple d'utilisation dans un controller:
 *
 * export const refreshTokens = async (req, res) => {
 *   try {
 *     const refreshToken = req.cookies.refreshToken;
 *
 *     if (!refreshToken) {
 *       return res.status(401).json({
 *         success: false,
 *         message: 'Refresh token manquant.'
 *       });
 *     }
 *
 *     const payload = await verifyRefreshToken(refreshToken);
 *
 *     // Récupérer l'utilisateur depuis la DB pour vérifier qu'il existe toujours
 *     const user = await User.findById(payload.userId);
 *
 *     if (!user) {
 *       clearRefreshTokenCookie(res);
 *       return res.status(401).json({
 *         success: false,
 *         message: 'Utilisateur non trouvé.'
 *       });
 *     }
 *
 *     // Générer de nouveaux tokens
 *     const newAccessToken = await generateAccessToken({
 *       userId: user._id,
 *       email: user.email,
 *       role: user.role
 *     });
 *
 *     const newRefreshToken = await generateRefreshToken({
 *       userId: user._id
 *     });
 *
 *     setRefreshTokenCookie(res, newRefreshToken);
 *
 *     res.json({
 *       success: true,
 *       accessToken: newAccessToken
 *     });
 *   } catch (error) {
 *     clearRefreshTokenCookie(res);
 *     res.status(401).json({
 *       success: false,
 *       message: 'Refresh token invalide ou expiré.',
 *       error: error.message
 *     });
 *   }
 * };
 */
