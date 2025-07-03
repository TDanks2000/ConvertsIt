"use client";

import Link from "next/link";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { toolCategories } from "@/constants/tools";
import { cn } from "@/lib/utils";

export function Navigation() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<Link href="/" className="flex items-center">
							Home
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				{toolCategories.map((category) => (
					<NavigationMenuItem key={category.label}>
						<NavigationMenuTrigger className="flex items-center gap-2">
							{category.icon}
							{category.label}
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div className="w-[400px] p-6 md:w-[500px] lg:w-[600px] xl:w-[700px]">
								<div className="mb-4 flex items-center gap-2 border-border border-b pb-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
										{category.icon}
									</div>
									<h3 className="font-semibold text-foreground text-sm">
										{category.label}
									</h3>
								</div>
								<ul className={cn("grid gap-2", category.ulClassName)}>
									{category.tools.map((tool) => (
										<ListItem
											key={tool.title}
											title={tool.title}
											href={tool.href}
											icon={tool.icon}
										>
											{tool.description}
										</ListItem>
									))}
								</ul>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = forwardRef<
	ComponentRef<typeof Link>,
	ComponentPropsWithoutRef<typeof Link> & {
		title: string;
		icon?: ReactNode;
	}
>(({ className, title, children, icon, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					ref={ref}
					className={cn(
						"group block select-none space-y-2 rounded-lg border border-transparent p-4 leading-none no-underline outline-none transition-all duration-200 hover:border-border hover:bg-accent/50 hover:shadow-sm focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
							{icon}
						</div>
						<div className="font-medium text-foreground text-sm leading-none group-hover:text-accent-foreground">
							{title}
						</div>
					</div>
					<p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed group-hover:text-muted-foreground/80">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
