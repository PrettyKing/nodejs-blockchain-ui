import React, { ReactNode } from 'react'

interface CardProps {
  title: string
  children: ReactNode
  className?: string
  icon?: ReactNode
}

const Card: React.FC<CardProps> = ({ title, children, className = '', icon }) => {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-primary-500">{icon}</div>}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default Card