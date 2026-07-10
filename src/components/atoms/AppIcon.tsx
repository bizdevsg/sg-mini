import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFacebookF, faGooglePlay, faInstagram, faTiktok, faWhatsapp, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faFax } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ComponentProps } from "react";
import {
  AlarmClock,
  Apple,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpFromLine,
  ArrowUpRightFromSquare,
  AudioWaveform,
  Bell,
  BellOff,
  Book,
  BookOpen,
  Building2,
  CalendarDays,
  ChartColumn,
  ChartLine,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleArrowDown,
  CircleHelp,
  Clock3,
  Coins,
  Copy,
  DollarSign,
  FileSignature,
  FileText,
  Flame,
  Gift,
  GraduationCap,
  Headset,
  History,
  House,
  Hourglass,
  Info,
  Layers3,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  Minus,
  Newspaper,
  PackageOpen,
  Percent,
  Phone,
  PowerOff,
  ReceiptText,
  Scale,
  Search,
  ShieldHalf,
  SlidersHorizontal,
  Tag,
  TriangleAlert,
  User,
  UserCog,
  UserPen,
  Users,
  Wallet,
  X,
  type LucideProps,
} from "lucide-react";

export type AppIconProp = string | readonly [string, string];

type AppIconProps = {
  className?: string;
  icon?: AppIconProp;
  strokeWidth?: number;
} & Omit<ComponentProps<typeof FontAwesomeIcon>, "icon">;

type LucideComponent = typeof House;

const LUCIDE_ICON_MAP: Record<string, LucideComponent> = {
  "alarm-clock": AlarmClock,
  apple: Apple,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-up-from-bracket": ArrowUpFromLine,
  "arrow-up-right-from-square": ArrowUpRightFromSquare,
  bars: Menu,
  bell: Bell,
  "bell-slash": BellOff,
  book: Book,
  "book-open": BookOpen,
  building: Building2,
  bullhorn: Megaphone,
  "calendar-days": CalendarDays,
  check: Check,
  "chart-column": ChartColumn,
  "chart-line": ChartLine,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "circle-down": CircleArrowDown,
  "circle-exclamation": CircleAlert,
  "circle-info": Info,
  "clipboard-question": CircleHelp,
  clock: Clock3,
  "clock-rotate-left": History,
  coins: Coins,
  copy: Copy,
  "dollar-sign": DollarSign,
  envelope: Mail,
  "file-invoice-dollar": ReceiptText,
  "file-lines": FileText,
  "file-signature": FileSignature,
  fire: Flame,
  gift: Gift,
  "graduation-cap": GraduationCap,
  headset: Headset,
  house: House,
  "hourglass-half": Hourglass,
  "layer-group": Layers3,
  "magnifying-glass": Search,
  minus: Minus,
  newspaper: Newspaper,
  "box-open": PackageOpen,
  percent: Percent,
  phone: Phone,
  "power-off": PowerOff,
  "right-from-bracket": LogOut,
  "scale-balanced": Scale,
  sliders: SlidersHorizontal,
  "shield-halved": ShieldHalf,
  tag: Tag,
  "triangle-exclamation": TriangleAlert,
  user: User,
  "user-gear": UserCog,
  "user-group": Users,
  "user-pen": UserPen,
  wallet: Wallet,
  "wave-square": AudioWaveform,
  xmark: X,
};

const FONT_AWESOME_ICON_MAP: Record<string, IconDefinition> = {
  facebook: faFacebookF,
  "facebook-f": faFacebookF,
  fax: faFax,
  "google-play": faGooglePlay,
  instagram: faInstagram,
  tiktok: faTiktok,
  whatsapp: faWhatsapp,
  x: faXTwitter,
  "x-twitter": faXTwitter,
  youtube: faYoutube,
};

function normalizeIcon(icon?: AppIconProp) {
  if (Array.isArray(icon)) {
    const [, name] = icon;

    return {
      name: typeof name === "string" ? name.toLowerCase() : "",
    };
  }

  if (typeof icon === "string") {
    return {
      name: icon.toLowerCase(),
    };
  }

  return {
    name: "",
  };
}

export function AppIcon({
  className,
  icon,
  strokeWidth = 2,
  ...restProps
}: AppIconProps) {
  const { name } = normalizeIcon(icon);
  const lucideIcon = LUCIDE_ICON_MAP[name];

  if (lucideIcon) {
    const LucideIcon = lucideIcon;

    return (
      <LucideIcon
        aria-hidden="true"
        className={className}
        strokeWidth={strokeWidth}
        {...(restProps as LucideProps)}
      />
    );
  }

  const fontAwesomeIcon = FONT_AWESOME_ICON_MAP[name];

  if (fontAwesomeIcon) {
    return (
      <FontAwesomeIcon
        aria-hidden="true"
        className={className}
        icon={fontAwesomeIcon}
        {...restProps}
      />
    );
  }

  return (
    <CircleHelp
      aria-hidden="true"
      className={className}
      strokeWidth={strokeWidth}
      {...(restProps as LucideProps)}
    />
  );
}
