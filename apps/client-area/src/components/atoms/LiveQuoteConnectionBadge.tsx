import { getMessages, type AppLocale } from "@/locales";

type LiveQuoteConnectionBadgeProps = {
  locale: AppLocale;
  status: "connecting" | "live" | "reconnecting" | "error";
};

export function LiveQuoteConnectionBadge({
  locale,
  status,
}: LiveQuoteConnectionBadgeProps) {
  const connectionStatusMessages = getMessages(locale).liveQuoteTable.connectionStatus;
  const statusStyles = {
    connecting: {
      label: connectionStatusMessages.connecting,
      dot: "bg-yellow-500",
      text: "text-yellow-500",
      ring: "ring-yellow-500/20",
      bg: "bg-yellow-500/10",
    },
    live: {
      label: connectionStatusMessages.live,
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      ring: "ring-emerald-400/20",
      bg: "bg-emerald-400/10",
    },
    reconnecting: {
      label: connectionStatusMessages.reconnecting,
      dot: "bg-amber-400",
      text: "text-amber-400",
      ring: "ring-amber-400/20",
      bg: "bg-amber-400/10",
    },
    error: {
      label: connectionStatusMessages.error,
      dot: "bg-rose-400",
      text: "text-rose-400",
      ring: "ring-rose-400/20",
      bg: "bg-rose-400/10",
    },
  } as const;
  const styles = statusStyles[status];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ring-1 ${styles.text} ${styles.bg} ${styles.ring}`}
    >
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      {styles.label}
    </div>
  );
}
