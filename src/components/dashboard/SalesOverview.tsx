import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

const stats = [
  {
    title: "Total Sales",
    value: "$12,345",
    icon: DollarSign,
    description: "Total sales this month",
  },
  {
    title: "Orders",
    value: "156",
    icon: ShoppingCart,
    description: "Total orders this month",
  },
  {
    title: "Customers",
    value: "89",
    icon: Users,
    description: "Active customers",
  },
  {
    title: "Pending Shipments",
    value: "23",
    icon: Package,
    description: "Orders to be shipped",
  },
];

const SalesOverview = () => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SalesOverview;