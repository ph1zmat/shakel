/**
 * Mistral AI — генерация веб-интерфейсов, анимаций и контента.
 *
 * Принимает пользовательский промпт и возвращает массив ComponentNode[],
 * которые можно напрямую добавить в canvas-store.
 */

import type { ComponentNode } from '../stores/canvas-store'
import type {
	StyleConfig,
	AnimationConfig,
	AnimationPreset,
	AnimationTrigger,
	EffectConfig,
} from '@/types/builder'

// ========================================
// Types
// ========================================

export interface AIGenerateRequest {
	prompt: string
	/** ID текущей страницы */
	pageId: string
	/** Координаты вставки */
	origin: { x: number; y: number }
	/** Контекст — какой тип контента (interface / animation / content) */
	mode: 'interface' | 'animation' | 'content' | 'auto'
}

export interface AIGenerateResult {
	nodes: ComponentNode[]
	explanation: string
}

// ========================================
// System prompt
// ========================================

const SYSTEM_PROMPT = `Ты — AI-движок визуального конструктора Shakel. Получаешь текстовое описание интерфейса и возвращаешь JSON-дерево компонентов.

ФОРМАТ ОТВЕТА (строго JSON, без markdown, без code-fences, без комментариев):
{"nodes":[...],"explanation":"Краткое описание на русском"}

СТРУКТУРА НОДЫ:
{"localId":"n1","parentLocalId":null,"type":"container","props":{},"styles":{"base":{}},"position":{"x":0,"y":0},"size":{"width":1280,"height":400},"rotation":0,"zIndex":1,"opacity":1,"animations":[],"effects":[]}

ТИПЫ КОМПОНЕНТОВ:
- container: props={direction:"row"|"column", gap:"none"|"sm"|"md"|"lg", align:"start"|"center"|"end"|"stretch", justify:"start"|"center"|"end"|"between"}
- grid: props={columns:1-4, gap:"none"|"sm"|"md"|"lg"}
- text: props={content:"...", as:"p"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"}
- heading: props={content:"...", level:1-6}
- button: props={text:"...", variant:"solid"|"outline"|"ghost"|"soft", size:"sm"|"md"|"lg"}
- link: props={text:"...", href:"#"}
- badge: props={text:"...", variant:"default"|"outline"|"destructive"}
- separator: props={}
- input: props={label:"...", placeholder:"...", type:"text"|"email"|"password"}
- textarea: props={label:"...", placeholder:"...", rows:3}
- select: props={label:"...", options:["A","B"]}
- form: props={submitLabel:"Submit"}
- image: props={src:"/placeholder.svg", alt:"...", objectFit:"cover"|"contain"}
- icon: props={iconName:"IconStar", size:24} (IconHome,IconUser,IconMail,IconSearch,IconHeart,IconCheck,IconArrowRight,IconSettings)
- card: props={title:"...", description:"..."}
- tabs: props={tabs:["Tab 1","Tab 2"]}
- group: props={label:"..."}

СТИЛИ (styles.base) — каждое значение объект:
Статическое: {"type":"static","value":"#1a1a2e"} или {"type":"static","value":"16","unit":"px"}
Токен: {"type":"token","tokenType":"color","value":"primary"} или {"type":"token","tokenType":"spacing","value":"md"}
Цвета-токены: primary, primary-foreground, secondary, destructive, muted, foreground, background, accent, border
Отступы-токены: xs, sm, md, lg, xl, 2xl
CSS-свойства: backgroundColor, color, fontSize, fontWeight, padding, borderRadius, gap, borderWidth, borderColor, textAlign, lineHeight, width, height, minHeight, maxWidth

АНИМАЦИИ: {"id":"a1","trigger":"onMount"|"onHover","preset":"fadeIn"|"slideUp"|"slideDown"|"scaleIn"|"bounceIn"|"pulse","duration":0.5,"delay":0,"ease":"easeOut","repeat":0}

ЭФФЕКТЫ: {"id":"e1","type":"dropShadow","visible":true,"offsetX":0,"offsetY":4,"blur":8,"spread":0,"color":"#00000025"}

ПРАВИЛА:
1. Корневой элемент — всегда container с position {x:0,y:0}, size {width:1280,height:auto-рассчитай}
2. Дочерние ноды указывают parentLocalId родителя
3. Не перекрывай элементы без причины
4. Размеры: кнопка 140x44, инпут 300x48, карточка 350x250, заголовок высота 48-64, текст высота 24-48
5. Генерируй осмысленный контент на русском
6. Максимум 20 нод за запрос
7. Ответ — ТОЛЬКО валидный JSON. Без trailing commas. Без комментариев`

// ========================================
// Mistral API call
// ========================================

export async function generateWithMistral(
	request: AIGenerateRequest,
): Promise<AIGenerateResult> {
	const apiKey = process.env.MISTRAL_API_KEY
	if (!apiKey) {
		throw new Error('MISTRAL_API_KEY is not set')
	}

	const modeHint = getModeHint(request.mode)

	const userPrompt = `${modeHint}

Запрос пользователя: ${request.prompt}

Сгенерируй дерево компонентов. Ответ — ТОЛЬКО чистый JSON, без markdown.`

	const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: 'mistral-large-latest',
			messages: [
				{ role: 'system', content: SYSTEM_PROMPT },
				{ role: 'user', content: userPrompt },
			],
			temperature: 0.7,
			max_tokens: 8192,
			response_format: { type: 'json_object' },
		}),
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`Mistral API error ${response.status}: ${errorText}`)
	}

	const data = await response.json()
	const content = data.choices?.[0]?.message?.content

	if (!content) {
		throw new Error('Empty response from Mistral API')
	}

	// Parse the JSON response — with cleanup for common AI mistakes
	const parsed = safeParseJSON(content)

	if (!parsed || !Array.isArray(parsed.nodes)) {
		throw new Error('AI response is not valid JSON or missing "nodes" array')
	}

	// Convert to real ComponentNodes
	const nodes = convertToComponentNodes(
		parsed.nodes ?? [],
		request.pageId,
		request.origin,
	)

	return {
		nodes,
		explanation: (typeof parsed.explanation === 'string' ? parsed.explanation : null) ?? 'Компоненты сгенерированы',
	}
}

// ========================================
// Robust JSON parsing — handles common AI mistakes
// ========================================

function safeParseJSON(raw: string): Record<string, unknown> | null {
	// 1. Try direct parse first
	try {
		return JSON.parse(raw)
	} catch {
		// continue to cleanup
	}

	let cleaned = raw.trim()

	// 2. Strip markdown code fences
	cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

	// 3. Extract first { ... } block if there's surrounding text
	const firstBrace = cleaned.indexOf('{')
	const lastBrace = cleaned.lastIndexOf('}')
	if (firstBrace !== -1 && lastBrace > firstBrace) {
		cleaned = cleaned.slice(firstBrace, lastBrace + 1)
	}

	// 4. Remove trailing commas before } or ]
	cleaned = cleaned.replace(/,\s*([}\]])/g, '$1')

	// 5. Remove single-line comments (// ...)
	cleaned = cleaned.replace(/\/\/[^\n]*/g, '')

	// 6. Remove multi-line comments (/* ... */)
	cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '')

	// 7. Try again
	try {
		return JSON.parse(cleaned)
	} catch {
		// last resort — try to find and parse just the nodes array
	}

	// 8. Last resort: try to extract "nodes" array manually
	const nodesMatch = cleaned.match(/"nodes"\s*:\s*(\[[\s\S]*\])/)
	if (nodesMatch) {
		try {
			const nodesStr = nodesMatch[1].replace(/,\s*([}\]])/g, '$1')
			const nodes = JSON.parse(nodesStr)
			return { nodes, explanation: 'Компоненты сгенерированы (восстановлено из частичного ответа)' }
		} catch {
			// give up
		}
	}

	return null
}

// ========================================
// Convert AI output → ComponentNode[]
// ========================================

function generateId(): string {
	return Math.random().toString(36).substring(2, 15)
}

function convertToComponentNodes(
	rawNodes: RawAINode[],
	pageId: string,
	origin: { x: number; y: number },
): ComponentNode[] {
	const idMap = new Map<string, string>()
	const result: ComponentNode[] = []

	// First pass — assign real IDs
	for (const raw of rawNodes) {
		const realId = generateId()
		idMap.set(raw.localId, realId)
	}

	// Second pass — build ComponentNode objects
	let order = 0
	for (const raw of rawNodes) {
		const realId = idMap.get(raw.localId)!
		const parentId = raw.parentLocalId
			? (idMap.get(raw.parentLocalId) ?? null)
			: null

		const node: ComponentNode = {
			id: realId,
			type: sanitizeType(raw.type),
			parentId,
			pageId,
			order: order++,
			props: raw.props ?? {},
			styles: sanitizeStyles(raw.styles),
			interactions: [],
			position: {
				x: origin.x + (raw.position?.x ?? 0),
				y: origin.y + (raw.position?.y ?? 0),
			},
			size: {
				width: raw.size?.width ?? 200,
				height: raw.size?.height ?? 48,
			},
			rotation: raw.rotation ?? 0,
			zIndex: raw.zIndex ?? order,
			opacity: raw.opacity ?? 1,
			locked: false,
			visible: true,
			constraints: { horizontal: 'left', vertical: 'top' },
			effects: sanitizeEffects(raw.effects),
			animations: sanitizeAnimations(raw.animations),
		}

		result.push(node)
	}

	return result
}

// ========================================
// Sanitizers — ensure valid data from AI
// ========================================

const VALID_TYPES = new Set([
	'container',
	'grid',
	'form',
	'text',
	'button',
	'image',
	'icon',
	'input',
	'textarea',
	'select',
	'heading',
	'link',
	'badge',
	'separator',
	'card',
	'tabs',
	'group',
])

function sanitizeType(type: string): string {
	return VALID_TYPES.has(type) ? type : 'container'
}

function sanitizeStyles(styles: unknown): StyleConfig {
	if (!styles || typeof styles !== 'object') return { base: {} }
	const s = styles as Record<string, unknown>
	return { base: (s.base as Record<string, unknown>) ?? {} } as StyleConfig
}

function sanitizeAnimations(animations: unknown): AnimationConfig[] {
	if (!Array.isArray(animations)) return []
	return animations
		.filter((a): a is Record<string, unknown> => !!a && typeof a === 'object')
		.map(a => ({
			id: String(a.id ?? generateId()),
			trigger: sanitizeEnum(
				a.trigger,
				['onMount', 'onHover', 'onClick', 'onScroll'],
				'onMount',
			) as AnimationTrigger,
			preset: sanitizeEnum(
				a.preset,
				[
					'fadeIn',
					'fadeOut',
					'slideUp',
					'slideDown',
					'slideLeft',
					'slideRight',
					'scaleIn',
					'scaleOut',
					'bounceIn',
					'rotateIn',
					'flipX',
					'flipY',
					'pulse',
					'shake',
					'custom',
				],
				'fadeIn',
			) as AnimationPreset,
			duration: typeof a.duration === 'number' ? a.duration : 0.5,
			delay: typeof a.delay === 'number' ? a.delay : 0,
			ease: sanitizeEnum(
				a.ease,
				['linear', 'easeIn', 'easeOut', 'easeInOut', 'spring'],
				'easeOut',
			),
			repeat: typeof a.repeat === 'number' ? a.repeat : 0,
		}))
}

function sanitizeEffects(effects: unknown): EffectConfig[] {
	if (!Array.isArray(effects)) return []
	return effects
		.filter((e): e is Record<string, unknown> => !!e && typeof e === 'object')
		.map(e => ({
			id: String(e.id ?? generateId()),
			type: sanitizeEnum(
				e.type,
				['dropShadow', 'innerShadow', 'layerBlur', 'backgroundBlur'],
				'dropShadow',
			) as EffectConfig['type'],
			visible: e.visible !== false,
			offsetX: typeof e.offsetX === 'number' ? e.offsetX : 0,
			offsetY: typeof e.offsetY === 'number' ? e.offsetY : 4,
			blur: typeof e.blur === 'number' ? e.blur : 8,
			spread: typeof e.spread === 'number' ? e.spread : 0,
			color: typeof e.color === 'string' ? e.color : '#00000025',
		}))
}

function sanitizeEnum<T extends string>(
	value: unknown,
	allowed: readonly T[],
	fallback: T,
): T {
	if (
		typeof value === 'string' &&
		(allowed as readonly string[]).includes(value)
	) {
		return value as T
	}
	return fallback
}

function getModeHint(mode: AIGenerateRequest['mode']): string {
	switch (mode) {
		case 'interface':
			return 'Режим: ИНТЕРФЕЙС. Пользователь хочет сгенерировать UI/лейаут: секции страницы, формы, навигацию, карточки. Фокусируйся на структуре, контейнерах, правильной иерархии компонентов.'
		case 'animation':
			return 'Режим: АНИМАЦИИ. Пользователь хочет компоненты С анимациями. Каждому значимому элементу добавь подходящую анимацию из списка пресетов. Используй stagger-эффект (разный delay для элементов).'
		case 'content':
			return 'Режим: КОНТЕНТ. Пользователь хочет текстовые блоки, статьи, описания. Фокусируйся на типографии, заголовках, параграфах, списках. Генерируй осмысленный реалистичный контент.'
		case 'auto':
		default:
			return 'Режим: АВТО. Определи по запросу пользователя, что именно нужно, и сгенерируй подходящую комбинацию UI-элементов, анимаций и контента.'
	}
}

// ========================================
// Raw AI node (before sanitization)
// ========================================

interface RawAINode {
	localId: string
	parentLocalId: string | null
	type: string
	props: Record<string, unknown>
	styles: unknown
	position: { x: number; y: number }
	size: { width: number; height: number }
	rotation?: number
	zIndex?: number
	opacity?: number
	animations?: unknown[]
	effects?: unknown[]
}
