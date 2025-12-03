import { Card, CardContent } from "@/components/ui/card";

export const StatCard = ({ value, label }) => {
  return (
    <Card className="bg-card border-border rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4 md:p-8 text-center">
        <h3 className="text-2xl md:text-5xl font-bold text-sky-500 mb-1 md:mb-2">{value}</h3>
        <p className="text-muted-foreground text-xs md:text-sm font-semibold">{label}</p>
      </CardContent>
    </Card>
  );
};
