"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { buildEnquiryPayload, sendEnquiry } from "@/lib/enquiry";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success"; reference: string } | { kind: "error"; message: string };

interface Props {
  siteId: string;
  fallbackEmail: string;
  children: ReactNode;
  className?: string;
  submitClassName: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
}

const noSubscription = () => () => {};

function newKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Submits the wrapped form fields to the shared Wow A Tour enquiry service. Fields named after the
 * service's core fields are sent as-is; any other named field is sent in `extra`.
 * Without JavaScript the submit button stays disabled and a notice points to the email address.
 */
export function EnquiryFormShell({ siteId, fallbackEmail, children, className, submitClassName, submitLabel, successTitle, successBody }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const ready = useSyncExternalStore(noSubscription, () => true, () => false);
  const renderedAt = useRef(0);
  const idempotencyKey = useRef("");

  useEffect(() => {
    renderedAt.current = Date.now();
    idempotencyKey.current = newKey();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "submitting") return;
    const payload = buildEnquiryPayload({
      siteId,
      idempotencyKey: idempotencyKey.current,
      entries: new FormData(event.currentTarget).entries(),
      sourceUrl: window.location.href,
      elapsedMs: Date.now() - renderedAt.current,
    });
    setStatus({ kind: "submitting" });
    setFieldErrors({});
    const result = await sendEnquiry(payload);
    if (result.kind === "success") {
      trackEvent(AnalyticsEvents.enquiry_submitted, { productRef: payload.productRef ?? undefined, path: window.location.pathname });
      setStatus(result);
      idempotencyKey.current = newKey();
      return;
    }
    setFieldErrors(result.errors);
    setStatus({ kind: "error", message: result.message });
  }

  if (status.kind === "success") {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-6" data-enquiry-success>
        <h2 className="text-xl font-semibold text-emerald-900">{successTitle}</h2>
        <p className="mt-2 text-emerald-800">{successBody}</p>
        <p className="mt-3 text-sm text-emerald-900">
          Your reference is <strong>{status.reference}</strong>.
        </p>
      </div>
    );
  }

  const errorList = Object.values(fieldErrors);
  return (
    <form className={className} method="post" onSubmit={onSubmit}>
      {children}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="enquiry-website">Leave this field empty</label>
        <input id="enquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {status.kind === "error" && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" data-enquiry-error>
          {status.message}
          {errorList.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {errorList.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
          <span className="mt-2 block">
            If the problem continues, email us at <a className="underline" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.
          </span>
        </div>
      )}
      <button type="submit" className={`${submitClassName} disabled:cursor-not-allowed disabled:opacity-60`} disabled={!ready || status.kind === "submitting"}>
        {status.kind === "submitting" ? "Sending…" : status.kind === "error" ? "Try again" : submitLabel}
      </button>
      <noscript>
        <p className="text-sm text-gray-700">This form needs JavaScript. Please email us at {fallbackEmail} instead.</p>
      </noscript>
      <p className="text-xs text-gray-500">
        We use your details only to reply to your enquiry. See our <Link className="underline" href="/privacy">privacy policy</Link>.
      </p>
    </form>
  );
}
