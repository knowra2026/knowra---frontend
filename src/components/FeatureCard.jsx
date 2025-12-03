import { Card, CardContent } from "@/components/ui/card";

// FeatureCard supports three modes:
// - variant: 'default' | 'large' | 'compact'
// - selectable: when true it shows a dashed/outlined visual around the card
export const FeatureCard = ({ icon: Icon, title, description, onClick, variant = 'default', selectable = false, className = '', disableHover = false, iconFilled = false }) => {
  const base = disableHover
    ? "transition-all duration-300 bg-card border-border rounded-2xl overflow-hidden"
    : "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-border rounded-2xl overflow-hidden";

  if (variant === 'large') {
    return (
      <Card className={`${base} ${className}`} onClick={onClick}>
        <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-6">
          <div className={`w-full rounded-xl p-6 md:p-8 ${selectable ? 'border-2 border-dashed border-[rgba(99,102,241,0.15)]' : ''}`}>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-accent ${iconFilled ? 'bg-sky-500' : 'group-hover:bg-sky-500'} transition-colors flex items-center justify-center`}>
                <Icon className={`${iconFilled ? 'w-8 h-8 text-white' : 'w-8 h-8 text-sky-500 group-hover:text-white'} transition-colors`} />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-foreground">{title}</h3>
              {description && <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">{description}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // compact / default
  const compact = variant === 'compact';
  return (
    <Card className={`${base} ${className}`} onClick={onClick}>
      <CardContent className={compact ? 'p-4 flex flex-col items-start gap-3' : 'p-6 md:p-8 flex flex-col items-center text-center gap-4 md:gap-6'}>
          <div className={compact ? 'flex items-center gap-3' : `w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent ${iconFilled ? 'bg-sky-500' : 'group-hover:bg-sky-500'} flex items-center justify-center`}>
            <Icon className={compact ? (iconFilled ? 'w-6 h-6 text-white' : 'w-6 h-6 text-sky-500') : (iconFilled ? 'w-8 h-8 md:w-10 md:h-10 text-white' : 'w-8 h-8 md:w-10 md:h-10 text-foreground group-hover:text-white transition-colors')} />
        </div>
        <div className={compact ? 'space-y-1 text-left' : 'space-y-3'}>
          <h3 className={compact ? 'text-sm font-semibold text-foreground' : 'text-xl md:text-2xl font-bold text-foreground'}>{title}</h3>
          {description && <p className={compact ? 'text-xs text-muted-foreground' : 'text-sm md:text-base text-muted-foreground leading-relaxed'}>{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
