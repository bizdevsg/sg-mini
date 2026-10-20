const CLIENT_AREA_LIVE_TIME_ZONE = "Asia/Jakarta";
const CLIENT_AREA_LIVE_DURATION_MINUTES = 60;
const WEEKDAY_CODES = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);

type ClientAreaLiveSchedule = {
  channelName: string;
  hour: number;
  href: string;
  id: string;
  minute: number;
};

export type ClientAreaActiveLiveSession = ClientAreaLiveSchedule & {
  occurrenceId: string;
};

export const CLIENT_AREA_LIVE_SCHEDULES: ClientAreaLiveSchedule[] = [
  {
    channelName: "Solid Prime",
    hour: 13,
    href: "https://www.tiktok.com/@solid.prime",
    id: "solid-prime-1330",
    minute: 30,
  },
  {
    channelName: "Solid News",
    hour: 8,
    href: "https://www.tiktok.com/@solidgold_news",
    id: "solid-news-0830",
    minute: 30,
  },
  {
    channelName: "Solid News",
    hour: 19,
    href: "https://www.tiktok.com/@solidgold_news",
    id: "solid-news-1900",
    minute: 0,
  },
];

function getJakartaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    timeZone: CLIENT_AREA_LIVE_TIME_ZONE,
    weekday: "short",
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    dateKey: `${values.year}-${values.month}-${values.day}`,
    hour: Number(values.hour),
    minute: Number(values.minute),
    weekday: values.weekday,
  };
}

export function getActiveClientAreaLiveSessions(
  date = new Date(),
): ClientAreaActiveLiveSession[] {
  const jakarta = getJakartaDateParts(date);

  if (!WEEKDAY_CODES.has(jakarta.weekday)) {
    return [];
  }

  const currentMinute = jakarta.hour * 60 + jakarta.minute;

  return CLIENT_AREA_LIVE_SCHEDULES.filter((schedule) => {
    const startMinute = schedule.hour * 60 + schedule.minute;
    return (
      currentMinute >= startMinute &&
      currentMinute < startMinute + CLIENT_AREA_LIVE_DURATION_MINUTES
    );
  })
    .sort(
      (left, right) =>
        right.hour * 60 + right.minute - (left.hour * 60 + left.minute),
    )
    .map((schedule) => ({
      ...schedule,
      occurrenceId: `${schedule.id}-${jakarta.dateKey}`,
    }));
}
