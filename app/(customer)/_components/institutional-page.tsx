import Header from "@/app/_components/header"

interface InstitutionalPageProps {
  eyebrow: string
  title: string
  description: string
  updatedAt?: string
  children: React.ReactNode
}

const InstitutionalPage = ({
  eyebrow,
  title,
  description,
  updatedAt,
  children,
}: InstitutionalPageProps) => {
  return (
    <div className="from-background via-background to-muted/20 min-h-svh bg-linear-to-br">
      <Header />

      <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-16">
        <header className="space-y-3 border-b pb-8">
          <p className="text-primary text-[11px] font-medium tracking-wider uppercase">
            {eyebrow}
          </p>
          <h1 className="text-2xl font-bold lg:text-4xl lg:font-extrabold">
            {title}
          </h1>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
          {updatedAt && (
            <p className="text-muted-foreground/70 text-xs">
              Última atualização: {updatedAt}
            </p>
          )}
        </header>

        <div className="mt-8 space-y-8">{children}</div>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

export const Section = ({ title, children }: SectionProps) => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold lg:text-xl">{title}</h2>
    <div className="text-muted-foreground space-y-3 text-sm leading-relaxed lg:text-base">
      {children}
    </div>
  </section>
)

export default InstitutionalPage
