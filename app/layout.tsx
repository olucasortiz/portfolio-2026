import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: { default:'Lucas Ortiz — Software Developer', template:'%s | Lucas Ortiz' }, description:'Portfólio de Lucas Ortiz. Desenvolvimento de software Full Stack, projetos e experiência.', icons: { icon: { url: '/perfil.png', type: 'image/png' } }, robots:{index:true,follow:true} };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="pt"><body>{children}</body></html>}
