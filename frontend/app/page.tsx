"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { ApplicationsTable } from "@/components/dashboard/applications-table";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import {
  ApplicationModal,
  type ApplicationFormData,
} from "@/components/dashboard/application-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import {
  getToken,
  removeToken,
  apiGetHome,
  apiGetUpcomingEvents,
  apiAddApplication,
  apiUpdateApplication,
  apiDeleteApplication,
} from "@/lib/api";
import type {
  Application,
  ApplicationStatus,
  HomeData,
  UpcomingEvent,
} from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // Auth check
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  // SWR fetchers
  const { data: homeData, mutate: mutateHome } = useSWR<HomeData>(
    ready ? "home" : null,
    apiGetHome,
    { revalidateOnFocus: false },
  );

  const { data: eventsData, mutate: mutateEvents } = useSWR<UpcomingEvent[]>(
    ready ? "events" : null,
    apiGetUpcomingEvents,
    { revalidateOnFocus: false },
  );

  // Filters
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteCompany, setDeleteCompany] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const applications = homeData?.applications ?? [];
  const stats = homeData?.stats ?? {
    totalApplications: 0,
    replyRate: 0,
    rejections: 0,
  };
  const events = eventsData ?? [];

  // Filtered applications
  const filteredApplications = useMemo(() => {
    let result = applications;
    if (statusFilter !== "all") {
      result = result.filter((app) => app.statuses === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app.company_name.toLowerCase().includes(q) ||
          app.position.toLowerCase().includes(q),
      );
    }
    return result;
  }, [applications, statusFilter, searchQuery]);

  // Handlers
  const handleAdd = useCallback(() => {
    setEditingApp(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((app: Application) => {
    setEditingApp(app);
    setModalOpen(true);
  }, []);

  const handleDeletePrompt = useCallback(
    (id: string) => {
      const app = applications.find((a) => a._id === id);
      setDeleteId(id);
      setDeleteCompany(app?.company_name ?? "this company");
    },
    [applications],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await apiDeleteApplication(deleteId);
      mutateHome();
      mutateEvents();
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete application");
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteId, mutateHome, mutateEvents]);

  const handleModalSubmit = useCallback(
    async (data: ApplicationFormData) => {
      try {
        if (editingApp) {
          await apiUpdateApplication(editingApp._id, data);
          mutateHome();
          mutateEvents();
        } else {
          await apiAddApplication(data);
          mutateHome();
          mutateEvents();
        }
      } catch {
        throw new Error("submit failed");
      }
    },
    [editingApp, mutateHome, mutateEvents],
  );

  const handleLogout = useCallback(() => {
    removeToken();
    router.push("/login");
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader onAddClick={handleAdd} onLogout={handleLogout} />

      {/* Sticky title + stats */}
      <div className="sticky top-[57px] z-30 bg-background border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-4 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Track and manage all your job applications in one place.
          </p>
          <StatsCards stats={stats} />
        </div>
      </div>

      {/* Scrollable content */}
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Two-column layout: Applications + Upcoming Events sidebar */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
            {/* Applications section */}
            <section className="flex min-w-0 flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Applications
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filteredApplications.length} result
                  {filteredApplications.length !== 1 ? "s" : ""}
                </span>
              </div>
              <FilterBar
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
              />
              <ApplicationsTable
                applications={filteredApplications}
                onEdit={handleEdit}
                onDelete={handleDeletePrompt}
              />
            </section>

            {/* Upcoming Events — sidebar on large screens */}
            <aside className="lg:sticky lg:top-20">
              <UpcomingEvents events={events} />
            </aside>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ApplicationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        application={editingApp}
        onSubmit={handleModalSubmit}
      />
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        companyName={deleteCompany}
      />
    </div>
  );
}
