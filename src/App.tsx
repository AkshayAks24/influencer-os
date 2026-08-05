import { StatCard } from "@/components/common/StatCard";
import { FiUsers, FiDollarSign, FiActivity } from "react-icons/fi";

function App() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total Influencers"
            value="12,405"
            icon={<FiUsers className="h-5 w-5" />}
            trend={{
              value: 12.5,
              label: "vs last month",
              direction: "up",
            }}
          />
          <StatCard
            label="Campaign Revenue"
            value="$45,231.89"
            icon={<FiDollarSign className="h-5 w-5" />}
            trend={{
              value: 2.1,
              label: "vs last month",
              direction: "down",
            }}
          />
          <StatCard
            label="Active Campaigns"
            value="34"
            icon={<FiActivity className="h-5 w-5" />}
            trend={{
              value: 0,
              label: "vs last month",
              direction: "neutral",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
