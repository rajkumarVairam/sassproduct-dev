import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { twoFactor } from "better-auth/plugins/two-factor";
import { passkey } from "@better-auth/passkey";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { db } from "@/db";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/config";

// ─── Stripe client (only created when keys are present) ──────────────────────
const stripeClient = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const appURL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Server auth instance ─────────────────────────────────────────────────────
export const auth = betterAuth({
  appName: siteConfig.name,

  database: drizzleAdapter(db, { provider: "pg" }),

  // ── Email + Password ──────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: `Reset your ${siteConfig.name} password`,
        html: `
          <p>Hi ${user.name},</p>
          <p>Someone requested a password reset for your account.</p>
          <p><a href="${url}">Reset password</a></p>
          <p>This link expires in 1 hour. If you didn't request this, you can safely ignore it.</p>
        `,
      });
    },
  },

  // ── Email Verification ────────────────────────────────────────────────────
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: `Verify your ${siteConfig.name} email`,
        html: `
          <p>Hi ${user.name},</p>
          <p>Thanks for signing up! Please verify your email address.</p>
          <p><a href="${url}">Verify email</a></p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        `,
      });
    },
  },

  // ── Session ───────────────────────────────────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
    updateAge: 60 * 60 * 24,       // refresh every 24 h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,              // 5-minute cookie cache reduces DB reads
    },
  },

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      "/api/auth/sign-in/email":    { window: 60, max: 5 },
      "/api/auth/sign-up/email":    { window: 60, max: 3 },
      "/api/auth/forgot-password":  { window: 60, max: 3 },
    },
  },

  // ── Security ──────────────────────────────────────────────────────────────
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
  },
  trustedOrigins: [appURL],

  // ── Plugins ───────────────────────────────────────────────────────────────
  plugins: [
    // Organizations / Teams + Roles & Permissions
    organization({
      allowUserToCreateOrganization: async (user) =>
        user.emailVerified === true,
      organizationLimit: 5,
      membershipLimit: 100,
      teams: { enabled: true, maximumTeams: 20 },
      invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days
      sendInvitationEmail: async ({ email, organization: org, inviter, invitation }) => {
        await sendEmail({
          to: email,
          subject: `You're invited to join ${org.name} on ${siteConfig.name}`,
          html: `
            <p>${inviter.user.name} invited you to join <strong>${org.name}</strong>.</p>
            <p><a href="${appURL}/accept-invite?token=${invitation.id}">Accept invitation</a></p>
            <p>This invitation expires in 7 days.</p>
          `,
        });
      },
    }),

    // Multi-Factor Authentication (TOTP + OTP email + backup codes)
    twoFactor({
      issuer: siteConfig.name,
      totpOptions: { digits: 6, period: 30 },
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          await sendEmail({
            to: user.email,
            subject: `Your ${siteConfig.name} verification code`,
            text: `Your one-time code is: ${otp}\n\nExpires in 5 minutes. Do not share this code.`,
          });
        },
        period: 5,
        allowedAttempts: 5,
        storeOTP: "encrypted",
      },
      backupCodeOptions: {
        amount: 10,
        length: 10,
        storeBackupCodes: "encrypted",
      },
      twoFactorCookieMaxAge: 600,           // 10-minute window after first factor
      trustDeviceMaxAge: 30 * 24 * 60 * 60, // remember device for 30 days
    }),

    // Passkeys (WebAuthn / passwordless)
    passkey({
      rpID: new URL(appURL).hostname,
      rpName: siteConfig.name,
      origin: appURL,
    }),

    // Stripe (customer + subscriptions) — only active when keys are configured
    ...(stripeClient && process.env.STRIPE_WEBHOOK_SECRET
      ? [
          stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            createCustomerOnSignUp: true,
            subscription: {
              enabled: true,
              plans: [
                {
                  name: "free",
                  // No priceId — free tier, no Stripe checkout needed
                  limits: { projects: 3, members: 5 },
                },
                {
                  name: "pro",
                  priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
                  limits: { projects: 50, members: 50 },
                  freeTrial: { days: 14 },
                },
                {
                  name: "enterprise",
                  priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? "",
                  limits: { projects: -1, members: -1 }, // -1 = unlimited
                },
              ],
            },
          }),
        ]
      : []),
  ],
});

// Inferred types — use these in Server Components and API routes
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
