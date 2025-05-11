'use client';

import { useSession } from '@/contexts/session-context';
import { DashboardContentContainer } from '@/modules/dashboard/dashboard-content-container';
import { DashboardSummaryContainer } from '@/modules/dashboard/dashboard-summary-contanier';

// Types based on the provided data
export default function Dashboard() {
  const { sessionUser } = useSession();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Welcome, {sessionUser?.name}</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your project invitations and tasks
        </p>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardSummaryContainer />
        <DashboardContentContainer />
      </div>
    </div>
  );
}
