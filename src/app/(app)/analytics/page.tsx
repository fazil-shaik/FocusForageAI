import { getAnalyticsData } from "./data";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();

    if (!data) return <div>Please login to view analytics</div>;

    return <AnalyticsDashboard data={data} />;
}
