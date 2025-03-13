import React from 'react'

interface HeaderPageProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function HeaderPage({ icon, title, description }: HeaderPageProps) {
  return (
    <div className="flex flex-col">
      <h2 className="flex flex-row items-center gap-2 font-bold text-2xl tracking-tight">
        <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10">
          {icon}
        </div>
        {title}
      </h2>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
