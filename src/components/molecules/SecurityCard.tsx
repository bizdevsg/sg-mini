import { SecurityCardCopy } from "@/components/atoms/SecurityCardCopy";
import { SecurityCardMedia } from "@/components/atoms/SecurityCardMedia";
import type { SecurityItem } from "@/types/landing";

type SecurityCardProps = {
  item: SecurityItem;
};

const securityCardStyles = {
  featured: {
    article: "min-h-[420px] rounded-[24px] p-6 sm:min-h-[500px] sm:p-9",
    copy: "max-w-[16rem] sm:max-w-[21rem]",
    mediaWrapper:
      "bottom-0 left-1/2 w-[94%] -translate-x-1/2 sm:w-[92%]",
    media: "",
  },
  wallet: {
    article: "min-h-[300px] rounded-[24px] p-6 sm:min-h-[260px] sm:p-8",
    copy: "max-w-[15rem] sm:max-w-[18rem]",
    mediaWrapper:
      "bottom-[-10px] right-[-8px] w-[150px] sm:bottom-[-16px] sm:right-[-12px] sm:w-[252px]",
    media: "rotate-[-12deg]",
  },
  lock: {
    article: "min-h-[300px] rounded-[24px] p-6 sm:min-h-[260px] sm:p-8",
    copy: "max-w-[15rem] sm:max-w-[18rem]",
    mediaWrapper:
      "bottom-[-10px] right-[-6px] w-[160px] sm:bottom-[-18px] sm:right-[-6px] sm:w-[266px]",
    media: "rotate-[10deg]",
  },
} satisfies Record<
  SecurityItem["variant"],
  {
    article: string;
    copy: string;
    mediaWrapper: string;
    media: string;
  }
>;

export function SecurityCard({ item }: SecurityCardProps) {
  const styles = securityCardStyles[item.variant];

  return (
    <article
      className={`group relative overflow-hidden border border-line bg-[radial-gradient(circle_at_bottom_right,rgba(205,161,58,0.16),transparent_34%),linear-gradient(180deg,#111111_0%,#0b0b0b_56%,#1a1308_100%)] text-white shadow-[0_22px_44px_rgba(0,0,0,0.28)] ${styles.article}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(205,161,58,0.14),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,217,138,0.12),transparent_26%)]" />
      <SecurityCardCopy
        title={item.title}
        body={item.body}
        className={styles.copy}
      />
      <SecurityCardMedia
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
        wrapperClassName={styles.mediaWrapper}
        className={styles.media}
      />
    </article>
  );
}
