declare module "aos" {
  export type AosOptions = {
    once?: boolean;
    duration?: number;
    easing?: string;
    offset?: number;
    disable?: string | boolean | (() => boolean);
  };

  const AOS: {
    init(options?: AosOptions): void;
    refresh(): void;
    refreshHard(): void;
  };

  export default AOS;
}
