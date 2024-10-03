'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function TagInputComponent() {
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Add a tag and press Enter"
        className="mb-2 hover:border-blue-400 focus:border-blue-400 transition-colors"
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            handleAddTag(e.currentTarget.value.trim())
            e.currentTarget.value = ''
          }
        }}
      />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm relative group hover:border-blue-400 hover:border transition-colors"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}