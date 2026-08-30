interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}

const PageHeader = ({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        {eyebrow && (
          <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl font-bold lg:text-3xl lg:font-extrabold">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default PageHeader
