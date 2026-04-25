-- Add onboardingSkipCount column to User table
-- This tracks how many times a user has skipped the onboarding flow
-- Once a user skips 5 times, the system will bypass onboarding automatically

ALTER TABLE "User" ADD COLUMN "onboardingSkipCount" INTEGER NOT NULL DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN "User"."onboardingSkipCount" IS 'Tracks how many times user has skipped onboarding. After 5 skips, onboarding is bypassed automatically.';
