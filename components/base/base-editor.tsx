'use client'

import dynamic from 'next/dynamic'

const BaseEditor = dynamic(() => import('@/components/base/base-text-editor'), {
  ssr: false,
})

export default BaseEditor
