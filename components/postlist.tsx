import {UserAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { JSX, SVGProps } from "react"

export function postlist() {
  return (
    <section className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img
          src="/placeholder.svg"
          alt="Blog Post Image"
          width={400}
          height={250}
          className="w-full h-48 object-cover"
          style={{ aspectRatio: "400/250", objectFit: "cover" }}
        />
        <div className="p-6 bg-background">
          <h3 className="text-2xl font-bold mb-2">Unlocking the Secrets of Productivity</h3>
          <div className="flex items-center mb-4 text-muted-foreground">
            <UserAvatar className="w-8 h-8 mr-2">
              <AvatarImage src="/placeholder-user.jpg" alt="Author" />
              <AvatarFallback>JD</AvatarFallback>
            </UserAvatar>
            <span>John Doe</span>
          </div>
          <p className="text-muted-foreground line-clamp-3">
            Discover the ultimate strategies to boost your productivity and achieve your goals. From time management
            techniques to task-prioritization hacks, this blog post has it all.
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <HeartIcon className="w-4 h-4" />
              <span>123 Likes</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircleIcon className="w-4 h-4" />
              <span>45 Comments</span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img
          src="/placeholder.svg"
          alt="Blog Post Image"
          width={400}
          height={250}
          className="w-full h-48 object-cover"
          style={{ aspectRatio: "400/250", objectFit: "cover" }}
        />
        <div className="p-6 bg-background">
          <h3 className="text-2xl font-bold mb-2">The Art of Mindful Living</h3>
          <div className="flex items-center mb-4 text-muted-foreground">
            <UserAvatar className="w-8 h-8 mr-2">
              <AvatarImage src="/placeholder-user.jpg" alt="Author" />
              <AvatarFallback>SA</AvatarFallback>
            </UserAvatar>
            <span>Sarah Adams</span>
          </div>
          <p className="text-muted-foreground line-clamp-3">
            Discover the transformative power of mindfulness and learn how to incorporate it into your daily life.
            Reduce stress, increase focus, and find inner peace.
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <HeartIcon className="w-4 h-4" />
              <span>78 Likes</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircleIcon className="w-4 h-4" />
              <span>22 Comments</span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img
          src="/placeholder.svg"
          alt="Blog Post Image"
          width={400}
          height={250}
          className="w-full h-48 object-cover"
          style={{ aspectRatio: "400/250", objectFit: "cover" }}
        />
        <div className="p-6 bg-background">
          <h3 className="text-2xl font-bold mb-2">The Future of Sustainable Design</h3>
          <div className="flex items-center mb-4 text-muted-foreground">
            <UserAvatar className="w-8 h-8 mr-2">
              <AvatarImage src="/placeholder-user.jpg" alt="Author" />
              <AvatarFallback>EM</AvatarFallback>
            </UserAvatar>
            <span>Emily Martinez</span>
          </div>
          <p className="text-muted-foreground line-clamp-3">
            Explore the latest trends and innovations in sustainable design, and learn how you can incorporate
            eco-friendly practices into your own projects.
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <HeartIcon className="w-4 h-4" />
              <span>92 Likes</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircleIcon className="w-4 h-4" />
              <span>31 Comments</span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img
          src="/placeholder.svg"
          alt="Blog Post Image"
          width={400}
          height={250}
          className="w-full h-48 object-cover"
          style={{ aspectRatio: "400/250", objectFit: "cover" }}
        />
        <div className="p-6 bg-background">
          <h3 className="text-2xl font-bold mb-2">The Rise of Remote Work</h3>
          <div className="flex items-center mb-4 text-muted-foreground">
            <UserAvatar className="w-8 h-8 mr-2">
              <AvatarImage src="/placeholder-user.jpg" alt="Author" />
              <AvatarFallback>JD</AvatarFallback>
            </UserAvatar>
            <span>John Doe</span>
          </div>
          <p className="text-muted-foreground line-clamp-3">
            Discover the benefits and challenges of remote work, and learn how to effectively manage a distributed team.
            Adapt to the new normal and thrive in the digital age.
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <HeartIcon className="w-4 h-4" />
              <span>105 Likes</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircleIcon className="w-4 h-4" />
              <span>52 Comments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}


function MessageCircleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}
