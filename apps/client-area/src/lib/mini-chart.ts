export type BuildChartUrlParams = {
  account: string;
  isDemo: boolean;
  symbol?: string;
  token: string;
  type?: string;
  typeDevice?: string;
  versionApp?: string;
};

export type ChartSession = Pick<
  BuildChartUrlParams,
  "account" | "isDemo" | "token"
>;

const LIVE_CHART_URL = "https://minichart.sgberjangka.com/";
const DEMO_CHART_URL = "https://demominichart.sgberjangka.com/";
const MINI_CHART_SYMBOL_ALIASES: Record<string, string> = {
  HKK50_BBJ: "HKK",
  JPK50_BBJ: "JPK",
};

export function resolveMiniChartSymbol(symbol: string): string {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return MINI_CHART_SYMBOL_ALIASES[normalizedSymbol] ?? normalizedSymbol;
}

export function buildChartUrl({
  account,
  isDemo,
  symbol = "XUL10",
  token,
  type = "R",
  typeDevice = process.env.MM_CHART_TYPE_DEVICE ?? "Web - ClientArea",
  versionApp = process.env.MM_CHART_VERSION_APP ?? "1.30.10 (259)",
}: BuildChartUrlParams): string {
  const url = new URL(isDemo ? DEMO_CHART_URL : LIVE_CHART_URL);

  // Keep this insertion order aligned with the MiniMicro WebView contract.
  url.searchParams.set("account", account);
  url.searchParams.set("version_app", versionApp);
  url.searchParams.set("symbol", resolveMiniChartSymbol(symbol));
  url.searchParams.set("type_device", typeDevice);
  url.searchParams.set("type", type);
  url.searchParams.set("token", token);

  return url.toString();
}

const SYMBOL_PATTERN = /^[A-Z0-9._-]{1,20}$/i;

export function buildChartUrlResponse(
  request: Request,
  session: ChartSession | null,
): Response {
  const symbol = new URL(request.url).searchParams.get("symbol") ?? "XUL10";
  const responseInit = {
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  };

  if (!SYMBOL_PATTERN.test(symbol)) {
    return Response.json({ error: "INVALID_SYMBOL" }, { ...responseInit, status: 400 });
  }

  if (!session?.account) {
    return Response.json(
      { error: "SESSION_EXPIRED" },
      { ...responseInit, status: 401 },
    );
  }

  return Response.json(
    {
      url: buildChartUrl({
        ...session,
        symbol: symbol.toUpperCase(),
      }),
    },
    responseInit,
  );
}
