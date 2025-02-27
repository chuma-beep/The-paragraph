
'use client'
import DeployButton from "../../components/LogoButton";
import AuthButton from "../../components/AuthButton";
import MainFooter from "@/components/main-footer";
import PostList from "@/app/postlist/PostList";
import { WriteIcon } from '@/components/WriteIcon';
import Search from '@/components/Search/Search'
import { ComponentsBlogSidebar } from "@/components/BlogSideBar";
import { ModeToggle } from "@/components/toggle-theme";
import * as Tooltip from "@radix-ui/react-tooltip"




export default function  Community() {

  return (
    <div data-testid="Home"  className="w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex items-center text-sm gap-0">
          <DeployButton />
          <div className="flex flex-row-reverse w-full mr-1 items-end gap-1">
          <Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<span className="IconButton">
						<WriteIcon />
					</span>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="TooltipContent" sideOffset={5}>
						  Write
						{/* <Tooltip.Arrow className="TooltipArrow" > */}
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
    <Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<span className="IconButton">
          <ModeToggle/>
					</span>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="TooltipContent" sideOffset={5}>
						  Theme
						{/* <Tooltip.Arrow className="TooltipArrow" /> */}
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
    <Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<span className="IconButton">
						<Search />
					</span>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="TooltipContent" sideOffset={5}>
                          Search
						{/* <Tooltip.Arrow className="TooltipArrow" /> */}
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
          </div>
          <AuthButton />
        </div>
      </nav>
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
          
        <main className="flex flex-row  justify-between">
          <span className="h-fit">

        <ComponentsBlogSidebar />
          </span>
          <span
           className=""
          >

          <PostList />
          </span>
        </main>

      </div>
      <div>
        <MainFooter />
      </div>
    </div>
  );
}