"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, Clock, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"   
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BookmarkedPost {
  id: number
  title: string
  excerpt: string
  date: string
  readLater: boolean
}

export default function Component() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([
    { id: 1, title: "Getting Started with Next.js", excerpt: "Learn the basics of Next.js and start building awesome React applications.", date: "2023-05-15", readLater: false },
    { id: 2, title: "Advanced React Patterns", excerpt: "Dive deep into advanced React patterns to level up your development skills.", date: "2023-06-02", readLater: true },
    { id: 3, title: "The Future of Web Development", excerpt: "Explore upcoming trends and technologies shaping the future of web development.", date: "2023-06-10", readLater: false },
  ])

  const [filter, setFilter] = useState('all')

  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (filter === 'all') return true
    if (filter === 'readLater') return bookmark.readLater
    return false
  })

  const toggleReadLater = (id: number) => {
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === id ? { ...bookmark, readLater: !bookmark.readLater } : bookmark
    ))
  }

  const removeBookmark = (id: number) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">My Bookmarked Posts</CardTitle>
            <CardDescription>Your saved articles for later reading</CardDescription>
          </div>
          <Select onValueChange={setFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter bookmarks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookmarks</SelectItem>
              <SelectItem value="readLater">Read Later</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">{bookmark.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bookmark.excerpt}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="secondary">{bookmark.date}</Badge>
                  {bookmark.readLater && <Badge variant="outline">Read Later</Badge>}
                </div>
              </div>
              <div className="flex items-center mt-3 sm:mt-0 sm:ml-4 space-x-2">
                <Button variant="outline" size="sm" onClick={() => toggleReadLater(bookmark.id)}>
                  {bookmark.readLater ? <Bookmark className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
                  {bookmark.readLater ? 'Bookmarked' : 'Read Later'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeBookmark(bookmark.id)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}