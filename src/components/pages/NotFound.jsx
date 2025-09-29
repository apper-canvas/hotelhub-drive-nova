import React from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400 inline-block">
          <ApperIcon name="AlertTriangle" size={64} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-slate-600 mb-8">Page not found</p>
        <Link to="/" className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound