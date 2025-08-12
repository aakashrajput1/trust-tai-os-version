import HRNav from '@/components/ui/HRNav'

export default function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HRNav>
      {children}
    </HRNav>
  )
}
