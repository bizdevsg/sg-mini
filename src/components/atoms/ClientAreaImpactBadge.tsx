type ClientAreaImpactBadgeProps = {
  impactScore: number;
  label: string;
};

function getImpactIconSrc(impactScore: number) {
  if (impactScore >= 3) {
    return "/assets/icon-impact/high-impact.svg";
  }

  if (impactScore === 2) {
    return "/assets/icon-impact/med-impact.svg";
  }

  return "/assets/icon-impact/low-impact.svg";
}

export function ClientAreaImpactBadge({
  impactScore,
  label,
}: ClientAreaImpactBadgeProps) {
  return (
    <div className="inline-flex shrink-0 items-center" title={label} aria-label={label}>
      <img
        src={getImpactIconSrc(impactScore)}
        alt={label}
        className="h-6 w-auto"
      />
    </div>
  );
}
