interface SelectModeButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick: () => void;
}

export function SelectModeButton(props: SelectModeButtonProps) {
  const { icon, title, description, selected = false, onClick } = props;

  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-lg border-2 transition-all text-left cursor-pointer ${selected
        ? "border-primary bg-primary/5"
        : "border-border hover:border-primary/50"
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${selected ? "bg-primary text-white" : "bg-muted"}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {selected && (
        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
      )}
    </button>
  )
}