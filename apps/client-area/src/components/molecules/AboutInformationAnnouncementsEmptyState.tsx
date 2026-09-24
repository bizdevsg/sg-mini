import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AboutInformationAnnouncementsEmptyStateProps = {
  title: string;
  body: string;
};

export function AboutInformationAnnouncementsEmptyState({
  title,
  body,
}: AboutInformationAnnouncementsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-yellow-500/10 bg-yellow-500/[0.03] py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10">
        <FontAwesomeIcon
          icon={["fas", "bell-slash"]}
          className="text-2xl text-yellow-500/60"
        />
      </div>
      <p className="text-base font-semibold text-white/60">{title}</p>
      <p className="mt-2 text-sm text-foreground/40">{body}</p>
    </div>
  );
}
