-- CreateEnum
CREATE TYPE "roles" AS ENUM ('ADMINISTRATOR', 'USER', 'SUPER_USER');

-- CreateEnum
CREATE TYPE "bot_color_modes" AS ENUM ('RED', 'ORANGE', 'AMBER', 'YELLOW', 'LIME', 'GREEN', 'EMERALD', 'TEAL', 'CYAN', 'SKY', 'BLUE', 'INDIGO', 'VIOLET', 'PURPLE', 'FUCHSIA', 'PINK', 'ROSE');

-- CreateEnum
CREATE TYPE "bot_rounded_modes" AS ENUM ('ROUNDED_NONE', 'ROUNDED_SM', 'ROUNDED_NORMAL', 'ROUNDED_MD', 'ROUNDED_LG', 'ROUNDED_XL', 'ROUNDED_2XL', 'ROUNDED_3XL', 'ROUNDED_FULL');

-- CreateEnum
CREATE TYPE "bot_shadow_modes" AS ENUM ('SHADOW_NONE');

-- CreateEnum
CREATE TYPE "primary_modes" AS ENUM ('Centar', 'Poiret', 'Rebel', 'Songer', 'Colus', 'Gora', 'Gorod', 'Oranien', 'Vollkorn', 'Yarin', 'Aqum', 'Bemount', 'Buyan', 'Cheque', 'Furore', 'Kabrio', 'Matchup', 'Mont', 'Next');

-- CreateEnum
CREATE TYPE "secondary_modes" AS ENUM ('Roboto', 'Montserrat', 'Inter', 'Oswald', 'Lora', 'Bitter', 'Comfortaa', 'Yanone', 'Russo', 'Alternates', 'Advent');

-- CreateEnum
CREATE TYPE "general_color_modes" AS ENUM ('LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "text_color_modes" AS ENUM ('SLATE', 'GRAY', 'ZINC', 'NEUTRAL', 'STONE');

-- CreateEnum
CREATE TYPE "accent_color_modes" AS ENUM ('RED', 'ORANGE', 'AMBER', 'YELLOW', 'LIME', 'GREEN', 'EMERALD', 'TEAL', 'CYAN', 'SKY', 'BLUE', 'INDIGO', 'VIOLET', 'PURPLE', 'FUCHSIA', 'PINK', 'ROSE');

-- CreateEnum
CREATE TYPE "screen_types" AS ENUM ('ACTION', 'BLOG', 'COLLECTION', 'CONTENT', 'FEATURE', 'FAQ', 'GALLERY', 'TESTIMONIAL', 'FOOTER', 'HEADER', 'FORM', 'HERO', 'NOTFOUND', 'PRICING', 'STATS');

-- CreateEnum
CREATE TYPE "component_variables" AS ENUM ('V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8');

-- CreateEnum
CREATE TYPE "component_types" AS ENUM ('CARD', 'FAQLIST', 'IMAGE', 'INPUT', 'LINK', 'HEADING', 'CHECK', 'TYPOGRAPHY', 'BLOCKQUOTE', 'BLOCKNAMING', 'TITLE', 'PARAGRAPH', 'SVG');

-- CreateEnum
CREATE TYPE "fields" AS ENUM ('PARAGRAPH', 'QUOTE', 'TITLE', 'BLOCKNAME', 'HEADLINK', 'DESCRIPTION', 'READLINK', 'HEAD', 'ROW1', 'ROW2', 'NAME', 'TEXT', 'BODY', 'CHECK', 'HEADING', 'CHECKLIST', 'CHECKHEAD', 'BLOCKQUOTE', 'PARAGRAPHLIST', 'DATES', 'LABEL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "isAuthenticated" BOOLEAN NOT NULL DEFAULT false,
    "roles" "roles" NOT NULL DEFAULT 'USER',
    "authdata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "bots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commands" (
    "id" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "botId" TEXT NOT NULL,

    CONSTRAINT "commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "paymentToken" TEXT,
    "paymentMethod" TEXT,
    "roundMode" "bot_rounded_modes" NOT NULL DEFAULT 'ROUNDED_MD',
    "accentColor" "bot_color_modes" NOT NULL DEFAULT 'BLUE',
    "shadowMode" "bot_shadow_modes" NOT NULL DEFAULT 'SHADOW_NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "botId" TEXT NOT NULL,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "price" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appId" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auto_messages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "botId" TEXT NOT NULL,

    CONSTRAINT "auto_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inline_keyboards" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "row" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "inline_keyboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reply_keyboards" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "row" INTEGER NOT NULL DEFAULT 0,
    "commandId" TEXT,
    "autoMessageId" TEXT,

    CONSTRAINT "reply_keyboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "primaryFont" "primary_modes" NOT NULL DEFAULT 'Centar',
    "secondaryFont" "secondary_modes" NOT NULL DEFAULT 'Roboto',
    "generalColor" "general_color_modes" NOT NULL DEFAULT 'DARK',
    "accentColor" "accent_color_modes" NOT NULL DEFAULT 'BLUE',
    "textColor" "text_color_modes" NOT NULL DEFAULT 'SLATE',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "web_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screens" (
    "id" SERIAL NOT NULL,
    "types" "screen_types" NOT NULL,
    "variable" "component_variables" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components" (
    "id" SERIAL NOT NULL,
    "type" "component_types" NOT NULL,
    "theme" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "field" "fields",
    "placeholder" TEXT,
    "array" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "screenId" INTEGER NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bots_token_key" ON "bots"("token");

-- CreateIndex
CREATE UNIQUE INDEX "apps_botId_key" ON "apps"("botId");

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commands" ADD CONSTRAINT "commands_botId_fkey" FOREIGN KEY ("botId") REFERENCES "bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apps" ADD CONSTRAINT "apps_botId_fkey" FOREIGN KEY ("botId") REFERENCES "bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_appId_fkey" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_messages" ADD CONSTRAINT "auto_messages_botId_fkey" FOREIGN KEY ("botId") REFERENCES "bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inline_keyboards" ADD CONSTRAINT "inline_keyboards_botId_fkey" FOREIGN KEY ("botId") REFERENCES "bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply_keyboards" ADD CONSTRAINT "reply_keyboards_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "commands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply_keyboards" ADD CONSTRAINT "reply_keyboards_autoMessageId_fkey" FOREIGN KEY ("autoMessageId") REFERENCES "auto_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_projects" ADD CONSTRAINT "web_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screens" ADD CONSTRAINT "screens_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "web_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
