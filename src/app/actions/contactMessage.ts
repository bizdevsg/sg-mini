"use server";

import { createDummyContactMessageState } from "@/lib/api-dummy-data";
import { CONTACT_MESSAGE_API_URL, USE_DUMMY_API_DATA } from "@/lib/env";

export type ContactMessageState = {
  status: "idle" | "success" | "error";
  message: string;
  reportId?: string;
};

type ContactMessageApiResponse = {
  message?: string;
  data?: {
    id_laporan?: string;
  };
};

const INITIAL_ERROR_MESSAGE = "Unable to send message.";

export async function submitContactMessage(
  _prevState: ContactMessageState,
  formData: FormData,
): Promise<ContactMessageState> {
  const nama = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const no_tlp = String(formData.get("phone") ?? "").trim();
  const subjek = String(formData.get("subject") ?? "").trim();
  const massage = String(formData.get("message") ?? "").trim();

  if (!nama || !email || !no_tlp || !subjek || !massage) {
    return {
      status: "error",
      message: "Please complete all required fields.",
    };
  }

  if (USE_DUMMY_API_DATA) {
    return createDummyContactMessageState(nama, subjek);
  }

  try {
    const response = await fetch(CONTACT_MESSAGE_API_URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama,
        email,
        no_tlp,
        subjek,
        massage,
      }),
    });

    const payload = (await response.json()) as ContactMessageApiResponse;

    if (!response.ok) {
      return {
        status: "error",
        message: payload.message || INITIAL_ERROR_MESSAGE,
      };
    }

    return {
      status: "success",
      message: payload.message || "Message sent successfully.",
      reportId: payload.data?.id_laporan,
    };
  } catch {
    return {
      status: "error",
      message: INITIAL_ERROR_MESSAGE,
    };
  }
}
