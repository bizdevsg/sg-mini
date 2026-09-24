declare module "aos" {
  type AosInitOptions = {
    offset?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
    easing?: string;
    disable?: boolean | string | (() => boolean);
    startEvent?: string;
    disableMutationObserver?: boolean;
  };

  const AOS: {
    init(options?: AosInitOptions): void;
    refresh(): void;
    refreshHard(): void;
  };

  export default AOS;
}
