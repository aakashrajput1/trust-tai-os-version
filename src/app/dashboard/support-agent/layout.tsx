import SupportAgentNav from '@/components/ui/SupportAgentNav'

export default function SupportAgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupportAgentNav>
      {children}
    </SupportAgentNav>
  )
}
