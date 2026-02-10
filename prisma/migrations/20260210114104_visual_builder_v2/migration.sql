/*
  Warnings:

  - You are about to drop the `apps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auto_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `components` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inline_keyboards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reply_keyboards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `screens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `web_projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "credential_type" AS ENUM ('OPENAI', 'ANTHROPIC', 'GEMINI', 'DEEPSEEK', 'MISTRAL', 'OLLAMA');

-- CreateEnum
CREATE TYPE "node_type" AS ENUM ('INITIAL', 'MANUAL_TRIGGER', 'HTTP_REQUEST', 'GOOGLE_FORM_TRIGGER', 'STRIPE_TRIGGER', 'ANTHROPIC', 'GEMINI', 'DEEPSEEK', 'MISTRAL', 'OLLAMA', 'OPENAI', 'DISCORD', 'SLACK');

-- CreateEnum
CREATE TYPE "execution_status" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "effect_type" AS ENUM ('SHADOW', 'BLUR', 'GLOW', 'BORDER');

-- CreateEnum
CREATE TYPE "platform" AS ENUM ('WEB', 'TELEGRAM_BOT', 'MOBILE_APP');

-- CreateEnum
CREATE TYPE "publish_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "viewport_mode" AS ENUM ('DESKTOP', 'TABLET', 'MOBILE', 'BOT_CHAT');

-- CreateEnum
CREATE TYPE "token_type" AS ENUM ('COLOR', 'SPACING', 'TYPOGRAPHY', 'EFFECT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "interaction_type" AS ENUM ('NAVIGATE', 'OPEN_MODAL', 'CLOSE_MODAL', 'SCROLL_TO', 'SHOW_FORM', 'HIDE_FORM', 'SET_STATE', 'TOGGLE_VISIBILITY', 'TRIGGER_WORKFLOW', 'SEND_MESSAGE', 'EDIT_MESSAGE', 'SHOW_KEYBOARD', 'HIDE_KEYBOARD');

-- CreateEnum
CREATE TYPE "artifact_type" AS ENUM ('NEXTJS_PAGE', 'NEXTJS_LAYOUT', 'NEXTJS_COMPONENT', 'REACT_COMPONENT', 'CSS_STYLESHEET', 'TAILWIND_CONFIG', 'NESTJS_HANDLER', 'NESTJS_MODULE', 'NESTJS_SERVICE', 'PACKAGE_JSON', 'DOCKERFILE');

-- DropForeignKey
ALTER TABLE "apps" DROP CONSTRAINT "apps_botId_fkey";

-- DropForeignKey
ALTER TABLE "auto_messages" DROP CONSTRAINT "auto_messages_botId_fkey";

-- DropForeignKey
ALTER TABLE "bots" DROP CONSTRAINT "bots_userId_fkey";

-- DropForeignKey
ALTER TABLE "commands" DROP CONSTRAINT "commands_botId_fkey";

-- DropForeignKey
ALTER TABLE "components" DROP CONSTRAINT "components_screenId_fkey";

-- DropForeignKey
ALTER TABLE "inline_keyboards" DROP CONSTRAINT "inline_keyboards_botId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_appId_fkey";

-- DropForeignKey
ALTER TABLE "reply_keyboards" DROP CONSTRAINT "reply_keyboards_autoMessageId_fkey";

-- DropForeignKey
ALTER TABLE "reply_keyboards" DROP CONSTRAINT "reply_keyboards_commandId_fkey";

-- DropForeignKey
ALTER TABLE "screens" DROP CONSTRAINT "screens_projectId_fkey";

-- DropForeignKey
ALTER TABLE "web_projects" DROP CONSTRAINT "web_projects_userId_fkey";

-- DropTable
DROP TABLE "apps";

-- DropTable
DROP TABLE "auto_messages";

-- DropTable
DROP TABLE "bots";

-- DropTable
DROP TABLE "commands";

-- DropTable
DROP TABLE "components";

-- DropTable
DROP TABLE "inline_keyboards";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "reply_keyboards";

-- DropTable
DROP TABLE "screens";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "web_projects";

-- DropEnum
DROP TYPE "accent_color_modes";

-- DropEnum
DROP TYPE "bot_color_modes";

-- DropEnum
DROP TYPE "bot_rounded_modes";

-- DropEnum
DROP TYPE "bot_shadow_modes";

-- DropEnum
DROP TYPE "component_types";

-- DropEnum
DROP TYPE "component_variables";

-- DropEnum
DROP TYPE "fields";

-- DropEnum
DROP TYPE "general_color_modes";

-- DropEnum
DROP TYPE "primary_modes";

-- DropEnum
DROP TYPE "roles";

-- DropEnum
DROP TYPE "screen_types";

-- DropEnum
DROP TYPE "secondary_modes";

-- DropEnum
DROP TYPE "text_color_modes";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credential" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" "credential_type" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "node_type" NOT NULL,
    "position" JSONB NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "credentialId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connection" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "fromOutput" TEXT NOT NULL DEFAULT 'main',
    "toInput" TEXT NOT NULL DEFAULT 'main',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "execution_status" NOT NULL DEFAULT 'RUNNING',
    "error" TEXT,
    "errorStack" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "inngestEventId" TEXT NOT NULL,
    "output" JSONB,

    CONSTRAINT "execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_system" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "design_system_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "color_token" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hue" INTEGER NOT NULL DEFAULT 0,
    "saturation" INTEGER NOT NULL DEFAULT 0,
    "lightness" INTEGER NOT NULL DEFAULT 0,
    "alpha" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "isSemantic" BOOLEAN NOT NULL DEFAULT false,
    "semanticRole" TEXT,
    "designSystemId" TEXT NOT NULL,

    CONSTRAINT "color_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spacing_token" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "designSystemId" TEXT NOT NULL,

    CONSTRAINT "spacing_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typography_token" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "weights" INTEGER[],
    "fallback" TEXT NOT NULL DEFAULT 'system-ui, sans-serif',
    "minSize" DOUBLE PRECISION NOT NULL,
    "maxSize" DOUBLE PRECISION NOT NULL,
    "lineHeight" DOUBLE PRECISION NOT NULL,
    "designSystemId" TEXT NOT NULL,

    CONSTRAINT "typography_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "effect_token" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "effect_type" NOT NULL,
    "params" JSONB NOT NULL,
    "designSystemId" TEXT NOT NULL,

    CONSTRAINT "effect_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" "platform" NOT NULL,
    "status" "publish_status" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "designSystemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_project_config" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "domain" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "favicon" TEXT,
    "basePath" TEXT NOT NULL DEFAULT '/',

    CONSTRAINT "web_project_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_project_config" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "token" TEXT,
    "webhookUrl" TEXT,
    "parseMode" TEXT NOT NULL DEFAULT 'HTML',
    "disableWebPagePreview" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "bot_project_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isEntry" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "viewport" "viewport_mode" NOT NULL DEFAULT 'DESKTOP',
    "background" JSONB,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "component_node" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "pageId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'container',
    "library" TEXT NOT NULL DEFAULT 'built-in',
    "props" JSONB NOT NULL DEFAULT '{}',
    "styles" JSONB NOT NULL DEFAULT '{}',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "component_node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_binding" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "property" TEXT NOT NULL,
    "tokenType" "token_type" NOT NULL,
    "tokenName" TEXT NOT NULL,
    "isVariable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "style_binding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interaction" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "trigger" TEXT NOT NULL DEFAULT 'onClick',
    "type" "interaction_type" NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "workflowId" TEXT,
    "debounceMs" INTEGER NOT NULL DEFAULT 0,
    "showLoading" BOOLEAN NOT NULL DEFAULT false,
    "condition" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_artifact" (
    "id" TEXT NOT NULL,
    "type" "artifact_type" NOT NULL,
    "filePath" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "dependsOn" TEXT[],
    "projectId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_artifact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "connection_fromNodeId_toNodeId_fromOutput_toInput_key" ON "connection"("fromNodeId", "toNodeId", "fromOutput", "toInput");

-- CreateIndex
CREATE UNIQUE INDEX "execution_inngestEventId_key" ON "execution"("inngestEventId");

-- CreateIndex
CREATE UNIQUE INDEX "color_token_designSystemId_name_key" ON "color_token"("designSystemId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "spacing_token_designSystemId_name_key" ON "spacing_token"("designSystemId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "typography_token_designSystemId_name_key" ON "typography_token"("designSystemId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "effect_token_designSystemId_name_key" ON "effect_token"("designSystemId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "web_project_config_projectId_key" ON "web_project_config"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "bot_project_config_projectId_key" ON "bot_project_config"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "bot_project_config_token_key" ON "bot_project_config"("token");

-- CreateIndex
CREATE UNIQUE INDEX "page_projectId_slug_key" ON "page"("projectId", "slug");

-- CreateIndex
CREATE INDEX "component_node_pageId_parentId_order_idx" ON "component_node"("pageId", "parentId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "style_binding_nodeId_property_key" ON "style_binding"("nodeId", "property");

-- CreateIndex
CREATE INDEX "interaction_nodeId_trigger_idx" ON "interaction"("nodeId", "trigger");

-- CreateIndex
CREATE UNIQUE INDEX "code_artifact_projectId_filePath_key" ON "code_artifact"("projectId", "filePath");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credential" ADD CONSTRAINT "credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution" ADD CONSTRAINT "execution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "color_token" ADD CONSTRAINT "color_token_designSystemId_fkey" FOREIGN KEY ("designSystemId") REFERENCES "design_system"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spacing_token" ADD CONSTRAINT "spacing_token_designSystemId_fkey" FOREIGN KEY ("designSystemId") REFERENCES "design_system"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typography_token" ADD CONSTRAINT "typography_token_designSystemId_fkey" FOREIGN KEY ("designSystemId") REFERENCES "design_system"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "effect_token" ADD CONSTRAINT "effect_token_designSystemId_fkey" FOREIGN KEY ("designSystemId") REFERENCES "design_system"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_designSystemId_fkey" FOREIGN KEY ("designSystemId") REFERENCES "design_system"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_project_config" ADD CONSTRAINT "web_project_config_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_project_config" ADD CONSTRAINT "bot_project_config_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_node" ADD CONSTRAINT "component_node_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "component_node"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_node" ADD CONSTRAINT "component_node_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_binding" ADD CONSTRAINT "style_binding_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "component_node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "component_node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_artifact" ADD CONSTRAINT "code_artifact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
