import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import CustomSidebarContent from "@/components/SidebarContent"

export function AppSidebar() {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <CustomSidebarContent
          onProfileToggle={setProfileOpen}
          profileOpen={profileOpen}
        />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}