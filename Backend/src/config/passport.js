import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import prisma from "../prisma/index.js";
import { createJWT } from "../modules/auth.js";
import cloudinary from "../config/cloudinary.js";
import dotenv from "dotenv";
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const handleOAuthUser = async (profile, provider) => {
  try {
    console.log(`Tentative d'authentification ${provider} pour:`, profile.id);

    // 1. Chercher l'utilisateur
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { providerId: profile.id.toString() },
          { email: profile.emails?.[0]?.value },
        ],
      },
    });

    if (!user) {
      // 2. Créer un nouvel utilisateur
      const username =
        profile.displayName || profile.username || `user_${Date.now()}`;
      user = await prisma.user.create({
        data: {
          username: username,
          email: profile.emails?.[0]?.value,
          provider: provider,
          providerId: profile.id.toString(),
          password: null,
        },
      });
      console.log("Nouvel utilisateur créé:", user.id);
    }

    return user;
  } catch (error) {
    console.error("Erreur handleOAuthUser:", error);
    throw error;
  }
};

// Utiliser la même fonction pour Google et GitHub
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NEXT_PUBLIC_API_URL + "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Profile Google reçu:", profile); // Pour déboguer

        // Chercher l'utilisateur existant
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: profile.emails[0].value },
              { providerId: profile.id },
            ],
          },
        });

        // Récupérer et uploader la photo Google vers Cloudinary
        let avatarUrl = null;
        if (profile.photos && profile.photos[0]?.value) {
          const uploadResult = await cloudinary.uploader.upload(
            profile.photos[0].value,
            {
              folder: "avatars",
              transformation: [
                { width: 250, height: 250, crop: "fill", gravity: "face" },
              ],
            }
          );
          avatarUrl = uploadResult.secure_url;
        }

        if (!user) {
          // Créer un nouvel utilisateur
          user = await prisma.user.create({
            data: {
              username: profile.displayName,
              email: profile.emails[0].value,
              provider: "google",
              providerId: profile.id,
              avatar: avatarUrl,
            },
          });
          console.log("Nouvel utilisateur créé:", user);
        } else {
          // Mettre à jour l'utilisateur existant
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              avatar: avatarUrl,
              provider: "google",
              providerId: profile.id,
            },
          });
          console.log("Utilisateur mis à jour:", user);
        }

        const token = createJWT(user);
        user.token = token;
        return done(null, user);
      } catch (err) {
        console.error("Erreur d'authentification Google:", err);
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.NEXT_PUBLIC_API_URL + "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Profile GitHub reçu:", profile); // Pour déboguer

        // Chercher l'utilisateur existant
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: profile.emails?.[0]?.value },
              { providerId: profile.id.toString() },
            ],
          },
        });

        // Récupérer et uploader la photo GitHub vers Cloudinary
        let avatarUrl = null;
        if (profile.photos && profile.photos[0]?.value) {
          const uploadResult = await cloudinary.uploader.upload(
            profile.photos[0].value,
            {
              folder: "avatars",
              transformation: [
                { width: 250, height: 250, crop: "fill", gravity: "face" },
              ],
            }
          );
          avatarUrl = uploadResult.secure_url;
        }

        if (!user) {
          // Créer un nouvel utilisateur
          user = await prisma.user.create({
            data: {
              username: profile.username || profile.displayName,
              email: profile.emails?.[0]?.value,
              provider: "github",
              providerId: profile.id.toString(),
              avatar: avatarUrl,
            },
          });
          console.log("Nouvel utilisateur créé:", user);
        } else {
          // Mettre à jour l'utilisateur existant
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              avatar: avatarUrl,
              provider: "github",
              providerId: profile.id.toString(),
            },
          });
          console.log("Utilisateur mis à jour:", user);
        }

        const token = createJWT(user);
        user.token = token;
        return done(null, user);
      } catch (err) {
        console.error("Erreur d'authentification GitHub:", err);
        return done(err, null);
      }
    }
  )
);

export default passport;
