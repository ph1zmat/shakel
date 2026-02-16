/**
 * Editor layout — полноэкранный без сайдбаров дашборда.
 * Используется для Builder и других full-screen редакторов.
 */
export default function EditorLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <div className='h-screen w-screen overflow-hidden'>{children}</div>
}
