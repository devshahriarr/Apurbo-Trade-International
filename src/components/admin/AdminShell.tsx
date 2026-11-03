"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState, type ReactNode } from "react";
import { Activity, Archive, Boxes, Building2, ChevronDown, ChevronRight, FileText, LayoutDashboard, LogOut, Menu, Package, PanelLeftClose, Search, Settings2, Users } from "lucide-react";
import styles from "./admin.module.css";
import { AdminBusinessContext } from "./AdminBusinessContext";

type Business = { id: string; name: string; isActive: boolean };
const nav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Documents", href: "/admin/documents", icon: FileText },
  { label: "Businesses", href: "/admin/businesses", icon: Building2 },
  { label: "Parties", href: "/admin/parties", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: Boxes },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Templates", href: "/admin/templates", icon: Archive },
  { label: "Reports", href: "/admin/reports", icon: Activity },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
];

export default function AdminShell({ children, userName }: { children: ReactNode; userName: string }) {
  const pathname = usePathname(); const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]); const [businessId, setBusinessId] = useState(""); const [collapsed, setCollapsed] = useState(false); const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { fetch("/api/v1/businesses").then((r) => r.ok ? r.json() : []).then((list: Business[]) => { setBusinesses(list); const remembered = localStorage.getItem("ati-business"); const selected = list.find((b) => b.id === remembered)?.id ?? list[0]?.id ?? ""; setBusinessId(selected); if (selected) localStorage.setItem("ati-business", selected); }).catch(() => setBusinesses([])); }, []);
  const activeBusiness = businesses.find((business) => business.id === businessId);
  function changeBusiness(id: string) { setBusinessId(id); localStorage.setItem("ati-business", id); }
  const activeLabel = pathname === "/admin" ? "Overview" : nav.find((item) => item.href === pathname)?.label ?? (pathname.startsWith("/admin/documents") ? "Documents" : "Admin workspace");

  return <div className={`${styles.app} ${collapsed ? styles.collapsed : ""}`}>
    {mobileOpen && <button aria-label="Close navigation" className={styles.scrim} onClick={() => setMobileOpen(false)} />}
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}>
      <Link href="/admin" className={styles.brand}><span className={styles.brandMark}>A</span><span className={styles.brandCopy}><strong>ATI Workspace</strong><small>Business management</small></span></Link>
      <div className={styles.navLabel}>WORKSPACE</div><nav className={styles.navigation}>{nav.map(({ label, href, icon: Icon }) => { const selected = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`); return <Link key={href} onClick={() => setMobileOpen(false)} href={href} className={`${styles.navItem} ${selected ? styles.navSelected : ""}`} title={collapsed ? label : undefined}><Icon size={17}/><span>{label}</span>{label === "Documents" && <ChevronRight className={styles.navArrow} size={13}/>}</Link>; })}</nav>
      <div className={styles.sidebarBottom}><button className={styles.collapse} onClick={() => setCollapsed(!collapsed)}><PanelLeftClose size={17}/><span>Collapse sidebar</span></button><div className={styles.profile}><span>{(userName[0] ?? "A").toUpperCase()}</span><div><strong>{userName}</strong><small>Administrator</small></div></div></div>
    </aside>
    <section className={styles.mainColumn}>
      <header className={styles.topbar}><button className={styles.mobileMenu} aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20}/></button><div className={styles.breadcrumb}><span>Workspace</span><ChevronRight size={14}/><strong>{activeLabel}</strong></div><div className={styles.topActions}><label className={styles.businessSelect}><Building2 size={15}/><select aria-label="Active business" value={businessId} onChange={(e) => changeBusiness(e.target.value)}>{businesses.length ? businesses.map((business) => <option value={business.id} key={business.id}>{business.name}</option>) : <option value="">No business access</option>}</select><ChevronDown size={13}/></label><button title="Search" className={styles.searchShortcut} onClick={() => router.push("/admin/documents")}><Search size={16}/><span>Search</span><kbd>⌘ K</kbd></button><button className={styles.signOut} onClick={() => void signOut({ callbackUrl: "/admin/login" })}><LogOut size={16}/><span>Sign out</span></button></div></header>
      <AdminBusinessContext.Provider value={{ id: businessId, name: activeBusiness?.name ?? "your business" }}><main className={styles.content} data-business-id={businessId}><div className={styles.contentInner}>{children}</div></main></AdminBusinessContext.Provider>
    </section>
  </div>;
}
