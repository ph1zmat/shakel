// Projects Feature Types

export interface WebProject {
  id: string;
  name: string;
  domain?: string | null;
  primaryFont: PrimaryMode;
  secondaryFont: SecondaryMode;
  generalColor: GeneralColorMode;
  accentColor: AccentColorMode;
  textColor: TextColorMode;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  screens: Screen[];
}

export interface Screen {
  id: number;
  types: ScreenType;
  variable: ComponentVariable;
  order: number;
  projectId: string;
  components: Component[];
}

export interface Component {
  id: number;
  type: ComponentType;
  theme: string; // JSON string
  items: string; // JSON string
  field?: Field | null;
  placeholder?: string | null;
  array: boolean;
  order: number;
  screenId: number;
}

export type PrimaryMode =
  | 'Centar'
  | 'Poiret'
  | 'Rebel'
  | 'Songer'
  | 'Colus'
  | 'Gora'
  | 'Gorod'
  | 'Oranien'
  | 'Vollkorn'
  | 'Yarin'
  | 'Aqum'
  | 'Bemount'
  | 'Buyan'
  | 'Cheque'
  | 'Furore'
  | 'Kabrio'
  | 'Matchup'
  | 'Mont'
  | 'Next';

export type SecondaryMode =
  | 'Roboto'
  | 'Montserrat'
  | 'Inter'
  | 'Oswald'
  | 'Lora'
  | 'Bitter'
  | 'Comfortaa'
  | 'Yanone'
  | 'Russo'
  | 'Alternates'
  | 'Advent';

export type GeneralColorMode = 'LIGHT' | 'DARK';

export type TextColorMode = 'SLATE' | 'GRAY' | 'ZINC' | 'NEUTRAL' | 'STONE';

export type AccentColorMode =
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

export type ScreenType =
  | 'ACTION'
  | 'BLOG'
  | 'COLLECTION'
  | 'CONTENT'
  | 'FEATURE'
  | 'FAQ'
  | 'GALLERY'
  | 'TESTIMONIAL'
  | 'FOOTER'
  | 'HEADER'
  | 'FORM'
  | 'HERO'
  | 'NOTFOUND'
  | 'PRICING'
  | 'STATS';

export type ComponentVariable =
  | 'V1'
  | 'V2'
  | 'V3'
  | 'V4'
  | 'V5'
  | 'V6'
  | 'V7'
  | 'V8';

export type ComponentType =
  | 'CARD'
  | 'FAQLIST'
  | 'IMAGE'
  | 'INPUT'
  | 'LINK'
  | 'HEADING'
  | 'CHECK'
  | 'TYPOGRAPHY'
  | 'BLOCKQUOTE'
  | 'BLOCKNAMING'
  | 'TITLE'
  | 'PARAGRAPH'
  | 'SVG';

export type Field =
  | 'PARAGRAPH'
  | 'QUOTE'
  | 'TITLE'
  | 'BLOCKNAME'
  | 'HEADLINK'
  | 'DESCRIPTION'
  | 'READLINK'
  | 'HEAD'
  | 'ROW1'
  | 'ROW2'
  | 'NAME'
  | 'TEXT'
  | 'BODY'
  | 'CHECK'
  | 'HEADING'
  | 'CHECKLIST'
  | 'CHECKHEAD'
  | 'BLOCKQUOTE'
  | 'PARAGRAPHLIST'
  | 'DATES'
  | 'LABEL';

// API Types
export interface CreateProjectInput {
  name: string;
  domain?: string;
  primaryFont?: PrimaryMode;
  secondaryFont?: SecondaryMode;
  generalColor?: GeneralColorMode;
  accentColor?: AccentColorMode;
  textColor?: TextColorMode;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CreateScreenInput {
  types: ScreenType;
  variable: ComponentVariable;
  order?: number;
}

export interface CreateComponentInput {
  type: ComponentType;
  theme: Record<string, unknown>;
  items: Record<string, unknown>;
  field?: Field;
  placeholder?: string;
  array?: boolean;
  order?: number;
}
