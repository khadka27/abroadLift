-- Add phone and OTP fields to support WhatsApp-first verification with SMS fallback
ALTER TABLE "User"
ADD COLUMN "countryDialCode" TEXT,
ADD COLUMN "phoneNumber" TEXT,
ADD COLUMN "phoneE164" TEXT,
ADD COLUMN "prefersWhatsApp" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "otpCodeHash" TEXT,
ADD COLUMN "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN "otpLastChannel" TEXT;

-- Enforce unique global phone number format
CREATE UNIQUE INDEX "User_phoneE164_key" ON "User"("phoneE164");
