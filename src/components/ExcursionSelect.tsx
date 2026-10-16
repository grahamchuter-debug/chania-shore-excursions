"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { findEnquiryProduct, productRefFromQuery, type EnquiryProduct } from "@/lib/enquiry";

interface Props {
  products: readonly EnquiryProduct[];
  generalLabel: string;
}

function Select({ products, generalLabel, selected }: Props & { selected: string }) {
  return (
    <select id="excursion" name="productRef" defaultValue={selected} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
      <option value="">{generalLabel}</option>
      {products.map((p) => (
        <option key={p.slug} value={p.slug}>{p.title}</option>
      ))}
    </select>
  );
}

function SelectFromQuery(props: Props) {
  const product = findEnquiryProduct(props.products, productRefFromQuery(useSearchParams()));
  return <Select {...props} selected={product?.slug ?? ""} />;
}

/** Excursion choice sent as `productRef`; a known `?tour=<slug>` (or `?excursion=<slug>`) pre-selects it, anything else leaves the general option. */
export function ExcursionSelect(props: Props) {
  return (
    <Suspense fallback={<Select {...props} selected="" />}>
      <SelectFromQuery {...props} />
    </Suspense>
  );
}
