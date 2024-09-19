"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CiHeart } from "react-icons/ci";
import { LuMessageCircle } from "react-icons/lu";


export default function interactions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("likes")
  const [sortOrder, setSortOrder] = useState("desc")
  const blogPosts = [
    {
      id: 1,
      title: "The Benefits of Mindfulness",
      thumbnail: "/placeholder.svg",
      likes: 250,
      comments: 42,
      content: "Mindfulness has been shown to have numerous benefits for mental and physical health...",
    },
    {
      id: 2,
      title: "Exploring the World of Sustainable Fashion",
      thumbnail: "/placeholder.svg",
      likes: 180,
      comments: 28,
      content: "In today's climate-conscious world, sustainable fashion has become a growing trend...",
    },
    {
      id: 3,
      title: "The Rise of Remote Work: Challenges and Opportunities",
      thumbnail: "/placeholder.svg",
      likes: 320,
      comments: 65,
      content:
        "The COVID-19 pandemic has accelerated the shift towards remote work, presenting both challenges and opportunities...",
    },
    {
      id: 4,
      title: "Unlocking the Power of Creativity: Tips for Unleashing Your Inner Artist",
      thumbnail: "/placeholder.svg",
      likes: 190,
      comments: 37,
      content:
        "Creativity is a powerful tool that can unlock new possibilities and enrich our lives in countless ways...",
    },
    {
      id: 5,
      title: "The Importance of Self-Care: Strategies for a Healthier, Happier You",
      thumbnail: "/placeholder.svg",
      likes: 275,
      comments: 51,
      content:
        "In today's fast-paced world, it's easy to neglect our own well-being. However, practicing self-care is crucial...",
    },
  ]
  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === "likes") {
          return sortOrder === "asc" ? a.likes - b.likes : b.likes - a.likes
        } else {
          return sortOrder === "asc" ? a.comments - b.comments : b.comments - a.comments
        }
      })
  }, [blogPosts, searchTerm, sortBy, sortOrder])
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 p-6">
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 mr-4"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort by {sortBy === "likes" ? "Likes" : "Comments"} {sortOrder === "asc" ? "Ascending" : "Descending"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="likes">Likes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="comments">Comments</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <img
                src="/placeholder.svg"
                alt={post.title}
                width={400}
                height={225}
                className="rounded-t-lg object-cover w-full aspect-[16/9]"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                <div className="flex items-center mb-2">
                <CiHeart className="w-4 h-4 mr-1" />   
                  <span className="text-muted-foreground">{post.likes}</span>
                </div>
                <div className="flex items-center">
                <LuMessageCircle />
                  <span className="text-muted-foreground">{post.comments}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}


