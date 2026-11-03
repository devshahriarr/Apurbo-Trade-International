"use client";

import { Printer } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { DocumentType, DocumentStatus } from "@prisma/client";
import styles from "./print.module.css";

type PrintData = { id: string; documentType: DocumentType; documentNumber: string | null; documentDate: string; status: DocumentStatus; subject: string | null; referenceNumber: string | null; notes: string | null; terms: string | null; subtotal: string | null; discountAmount: string | null; taxAmount: string | null; totalAmount: string | null; amountInWords: string | null; customFields: Record<string, unknown>; businessSnapshot: { name?: string; nameBn?: string; address?: string; phone?: string; email?: string; logo?: string }; partySnapshot: { name?: string; companyName?: string; address?: string; phone?: string } | null; items: { description: string; quantity: string; unit: string | null; rate: string | null; amount: string | null; remarks: string | null }[]; template: { designVariant: string; pageSize: string } | null };
const labels: Record<DocumentType, string> = { INVOICE: "INVOICE", DELIVERY_CHALLAN: "DELIVERY CHALLAN", CASH_MEMO: "CASH MEMO", MONEY_RECEIPT: "MONEY RECEIPT", QUOTATION: "QUOTATION", PURCHASE_ORDER: "PURCHASE ORDER", WORK_ORDER: "WORK ORDER", OTHER: "DOCUMENT" };
const money = (value: string | null) => value == null ? "—" : `৳ ${Number(value).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;

export default function PrintDocument({ data }: { data: PrintData }) {
  const business = data.businessSnapshot; const modern = data.template?.designVariant !== "ORIGINAL";
  const pageSize = data.template?.pageSize === "A5" || data.template?.pageSize === "LETTER" ? data.template.pageSize : "A4";
  return <main className={`${styles.page} ${modern ? styles.modern : styles.original}`}>
    <style>{`@page { size: ${pageSize}; margin: 12mm; }`}</style>
    <div className={styles.toolbar}><Link href="/admin/documents">← Back to documents</Link><button onClick={() => window.print()}><Printer size={15}/>Print / Save PDF</button></div>
    <article className={styles.sheet}>
      {data.status === "CANCELLED" && <div className={styles.cancelStamp}>CANCELLED</div>}
      <header className={styles.header}>{business.logo && <Image src={business.logo} alt="Business logo" width={70} height={70} unoptimized/>}<div><h1>{business.name}</h1>{business.nameBn && <p lang="bn">{business.nameBn}</p>}<span>{business.address}</span><span>{business.phone}{business.email ? ` · ${business.email}` : ""}</span></div></header>
      <div className={styles.titleRow}><h2>{data.documentType === "OTHER" && data.customFields.title ? String(data.customFields.title) : labels[data.documentType]}</h2><div><strong>{data.documentNumber ?? "DRAFT"}</strong><span>{new Date(data.documentDate).toLocaleDateString("en-GB")}</span></div></div>
      {(data.partySnapshot || data.subject || data.referenceNumber) && <section className={styles.party}><div><small>{data.documentType === "PURCHASE_ORDER" ? "SUPPLIER" : "CUSTOMER / RECEIVER"}</small><strong>{data.partySnapshot?.companyName || data.partySnapshot?.name || "—"}</strong><span>{data.partySnapshot?.address}</span><span>{data.partySnapshot?.phone}</span></div><div><small>REFERENCE</small><strong>{data.referenceNumber || data.subject || "—"}</strong><span>{data.subject}</span></div></section>}
      {data.items.length > 0 && <table className={styles.items}><thead><tr><th>#</th><th>Description</th><th>Quantity</th>{data.items.some((item)=>item.rate != null) && <><th>Rate</th><th>Amount</th></>}</tr></thead><tbody>{data.items.map((item,index)=><tr key={index}><td>{index+1}</td><td>{item.description}{item.remarks && <small>{item.remarks}</small>}</td><td>{item.quantity} {item.unit}</td>{data.items.some((entry)=>entry.rate != null) && <><td>{money(item.rate)}</td><td>{money(item.amount)}</td></>}</tr>)}</tbody></table>}
      {Object.keys(data.customFields ?? {}).length > 0 && <section className={styles.party}><div><small>ADDITIONAL DETAILS</small>{Object.entries(data.customFields).map(([key,value])=>value != null && value !== "" && <p key={key}><strong>{key.replace(/([A-Z])/g," $1").replace(/^./,(c)=>c.toUpperCase())}: </strong>{key === "amount" ? money(String(value)) : String(value)}</p>)}</div></section>}
      {data.totalAmount != null && <section className={styles.totals}><div><span>Subtotal</span><strong>{money(data.subtotal)}</strong></div>{Number(data.discountAmount) > 0 && <div><span>Discount</span><strong>− {money(data.discountAmount)}</strong></div>}{Number(data.taxAmount) > 0 && <div><span>Tax</span><strong>{money(data.taxAmount)}</strong></div>}<div className={styles.grand}><span>Total</span><strong>{money(data.totalAmount)}</strong></div></section>}
      {data.amountInWords && <p className={styles.amountWords}><strong>In words: </strong>{data.amountInWords}</p>}
      {data.terms && <section className={styles.notes}><h3>Terms and conditions</h3><p>{data.terms}</p></section>}{data.notes && <section className={styles.notes}><h3>Notes</h3><p>{data.notes}</p></section>}
      <footer className={styles.signatures}><div><span>Receiver signature</span></div><div><span>Authorized signature</span></div></footer><p className={styles.footer}>{business.name} · {business.phone}</p>
    </article>
  </main>;
}
