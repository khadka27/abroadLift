-- OTP-only auth: password is no longer required
ALTER TABLE "User"
ALTER COLUMN "password" DROP NOT NULL;
