// Bots Feature Types

export interface Bot {
  id: string;
  name: string;
  token: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  commands: Command[];
  app?: App | null;
  autoMessages: AutoMessage[];
  inlineKeyboards: InlineKeyboard[];
}

export interface Command {
  id: string;
  command: string;
  response: string;
  createdAt: Date;
  updatedAt: Date;
  botId: string;
  replyKeyboards: ReplyKeyboard[];
}

export interface App {
  id: string;
  paymentToken?: string | null;
  paymentMethod?: string | null;
  roundMode: BotRoundedMode;
  accentColor: BotColorMode;
  shadowMode: BotShadowMode;
  createdAt: Date;
  updatedAt: Date;
  botId: string;
  products: Product[];
}

export interface Product {
  id: string;
  image?: string | null;
  price: string;
  currency: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  appId: string;
}

export interface AutoMessage {
  id: string;
  message: string;
  date: string;
  time: string;
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
  botId: string;
  replyKeyboards: ReplyKeyboard[];
}

export interface InlineKeyboard {
  id: string;
  label: string;
  command: string;
  botId: string;
  row: number;
}

export interface ReplyKeyboard {
  id: string;
  label: string;
  command: string;
  row: number;
  commandId?: string | null;
  autoMessageId?: string | null;
}

export type BotColorMode =
  | 'RED'
  | 'ORANGE'
  | 'AMBER'
  | 'YELLOW'
  | 'LIME'
  | 'GREEN'
  | 'EMERALD'
  | 'TEAL'
  | 'CYAN'
  | 'SKY'
  | 'BLUE'
  | 'INDIGO'
  | 'VIOLET'
  | 'PURPLE'
  | 'FUCHSIA'
  | 'PINK'
  | 'ROSE';

export type BotRoundedMode =
  | 'ROUNDED_NONE'
  | 'ROUNDED_SM'
  | 'ROUNDED_NORMAL'
  | 'ROUNDED_MD'
  | 'ROUNDED_LG'
  | 'ROUNDED_XL'
  | 'ROUNDED_2XL'
  | 'ROUNDED_3XL'
  | 'ROUNDED_FULL';

export type BotShadowMode = 'SHADOW_NONE';

// API Types
export interface CreateBotInput {
  name: string;
  token: string;
  description?: string;
}

export interface UpdateBotInput {
  name?: string;
  description?: string;
}

export interface CreateCommandInput {
  command: string;
  response: string;
}

export interface CreateProductInput {
  image?: string;
  price: string;
  currency?: string;
  description?: string;
}
