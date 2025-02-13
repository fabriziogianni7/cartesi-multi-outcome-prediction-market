// src/components/Layout.tsx
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import Navbar from '@/components/navbar';
import { Providers } from '@/app/providers';
import { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <SidebarProvider defaultOpen={false}>
          <div className="h-screen w-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
              <AppSidebar />
              <SidebarTrigger className="text-xl" />
              <main className="flex-1 bg-background p-4">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </Providers>
  );
}