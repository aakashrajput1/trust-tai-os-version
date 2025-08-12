import SalesNav from '@/components/ui/SalesNav'

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SalesNav>
      {children}
    </SalesNav>
  )
}
