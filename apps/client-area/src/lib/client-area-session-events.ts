/**
 * Browser-side signal that the SGB session is gone (an authenticated BFF call
 * answered 401). SGB allows one active login per account, so this is what the
 * customer sees when the account signs in on another device — the API only says
 * "session expired", it never states why, so callers must not claim a reason.
 */
export const CLIENT_AREA_SESSION_ENDED_EVENT = "client-area:session-ended";

export function signalClientAreaSessionEnded() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CLIENT_AREA_SESSION_ENDED_EVENT));
}
