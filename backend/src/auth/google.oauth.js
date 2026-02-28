import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../admin/user/user.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie
} from '../middleware/auth.middleware.js';
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

export const configureGoogleOAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            await user.updateLastLogin();
            return done(null, user);
          }

          console.log("😌😌😌", profile);

          // Vérifier si un utilisateur avec cet email existe déjà
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Un compte local existe avec cet email, lier le compte Google
            user.googleId = profile.id;
            user.provider = 'google';
            user.isEmailVerified = true; // Google vérifie les emails
            user.avatar = user.avatar || profile.photos[0]?.value;
            await user.save();
            await user.updateLastLogin();
            return done(null, user);
          }

          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            first_name: profile.displayName,
            last_name: profile.familyName,
            avatar: profile.photos[0]?.value,
            provider: 'google',
            isEmailVerified: true,
            role: 'customer'
          });

          await user.updateLastLogin();
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // Sérialisation de l'utilisateur pour la session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Désérialisation de l'utilisateur depuis la session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

/**
 * Controller pour initier l'authentification Google
 */
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

/**
 * Controller pour le callback Google OAuth
 */
export const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`${process.env.CORS_ORIGIN}/auth/login?error=oauth_failed`);
    }

    if (!user) {
      return res.redirect(`${process.env.CORS_ORIGIN}/auth/login?error=no_user`);
    }

    try {
      const accessToken = await generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      });

      const refreshToken = await generateRefreshToken({
        userId: user._id.toString()
      });

      setRefreshTokenCookie(res, refreshToken);

      // Rediriger vers le frontend avec l'access token
      // Le frontend devra extraire le token de l'URL et le stocker
      res.redirect(
        `${process.env.CORS_ORIGIN}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user.toPublicJSON()))}`
      );
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect(`${process.env.CORS_ORIGIN}/auth/login?error=token_failed`);
    }
  })(req, res, next);
};

export const googleLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error during logout'
      });
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
};

export default {
  configureGoogleOAuth,
  googleAuth,
  googleAuthCallback,
  googleLogout
};
