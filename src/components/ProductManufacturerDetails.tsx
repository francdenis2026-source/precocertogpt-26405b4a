import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Building2, Factory } from "lucide-react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./ProductManufacturerDetails.css";

type ProductIdentity = {
  id?: string;
  slug?: string | null;
  brand: string | null;
  manufacturer: string | null;
};

type CardIdentity = {
  element: HTMLAnchorElement;
  identity: ProductIdentity;
};

const clean = (value: string | null | undefined) => {
  const text = (value || "").trim();
  return text && text !== "-" && text !== "—" && text.toLocaleLowerCase("pt-BR") !== "não identificada" ? text : "";
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const getIdentifier = (href: string) => {
  const match = href.match(/\/produto\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

export function ProductManufacturerDetails() {
  const location = useLocation();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [identity, setIdentity] = useState<ProductIdentity | null>(null);
  const [cards, setCards] = useState<CardIdentity[]>([]);

  useEffect(() => {
    let active = true;
    let timer = 0;

    const scanCards = async () => {
      if (!supabase || !active) return;
      const elements = Array.from(document.querySelectorAll<HTMLAnchorElement>(
        ".store-pro-grid a[href^='/produto/'], .search26-grid a[href^='/produto/'], .ref-product-grid a[href^='/produto/']",
      ));
      if (!elements.length) {
        setCards([]);
        return;
      }

      const ids = Array.from(new Set(elements.map(element => getIdentifier(element.getAttribute("href") || "")).filter(Boolean)));
      const uuidIds = ids.filter(id => uuidPattern.test(id));
      const slugIds = ids.filter(id => !uuidPattern.test(id));
      const rows: ProductIdentity[] = [];

      if (uuidIds.length) {
        const response = await supabase.from("products").select("id, slug, brand").in("id", uuidIds);
        if (!response.error && response.data) rows.push(...response.data.map(row => ({ ...row, manufacturer: null })) as ProductIdentity[]);
      }
      if (slugIds.length) {
        const response = await supabase.from("products").select("id, slug, brand").in("slug", slugIds);
        if (!response.error && response.data) rows.push(...response.data.map(row => ({ ...row, manufacturer: null })) as ProductIdentity[]);
      }
      if (!active) return;

      const byIdentifier = new Map<string, ProductIdentity>();
      rows.forEach(row => {
        if (row.id) byIdentifier.set(String(row.id), row);
        if (row.slug) byIdentifier.set(String(row.slug), row);
      });

      setCards(elements.map(element => {
        const item = byIdentifier.get(getIdentifier(element.getAttribute("href") || ""));
        return item ? { element, identity: item } : null;
      }).filter((item): item is CardIdentity => Boolean(item)));
    };

    const scheduleScan = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void scanCards(), 120);
    };

    scheduleScan();
    const observer = new MutationObserver(scheduleScan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      active = false;
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    const match = location.pathname.match(/^\/produto\/([^/?#]+)/);
    if (!match) {
      setTarget(null);
      setIdentity(null);
      return;
    }

    const identifier = decodeURIComponent(match[1]);
    let active = true;

    const findTarget = () => {
      const node = document.querySelector<HTMLElement>(".pdp-meta");
      if (node && active) setTarget(node);
      return Boolean(node);
    };

    findTarget();
    const observer = new MutationObserver(() => { if (findTarget()) observer.disconnect(); });
    if (!document.querySelector(".pdp-meta")) observer.observe(document.body, { childList: true, subtree: true });

    const load = async () => {
      if (!supabase) return;
      const baseQuery = supabase.from("products").select("id, slug, brand");
      const brandResponse = uuidPattern.test(identifier)
        ? await baseQuery.eq("id", identifier).maybeSingle()
        : await baseQuery.eq("slug", identifier).maybeSingle();
      if (!active || brandResponse.error || !brandResponse.data) return;

      const base: ProductIdentity = { ...(brandResponse.data as any), manufacturer: null };
      setIdentity(base);

      const manufacturerQuery = supabase.from("products").select("manufacturer");
      const manufacturerResponse = uuidPattern.test(identifier)
        ? await manufacturerQuery.eq("id", identifier).maybeSingle()
        : await manufacturerQuery.eq("slug", identifier).maybeSingle();
      if (active && !manufacturerResponse.error && manufacturerResponse.data) {
        setIdentity({ ...base, manufacturer: (manufacturerResponse.data as any).manufacturer || null });
      }
    };

    void load();
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [location.pathname]);

  const detailPortal = target && identity ? createPortal(<>
    <div className="pdp-brand-detail">
      <Building2 aria-hidden="true" />
      <span><small>Marca</small><strong>{clean(identity.brand) || "Não informada"}</strong></span>
    </div>
    <div className="pdp-manufacturer-detail">
      <Factory aria-hidden="true" />
      <span><small>Fabricante</small><strong>{clean(identity.manufacturer) || "Não informado"}</strong></span>
    </div>
  </>, target) : null;

  return <>
    {cards.map(({ element, identity: item }) => {
      const brand = clean(item.brand);
      if (!brand) return null;
      return createPortal(
        <span className="pc-product-brand-badge" aria-label={`Marca ${brand}`}><small>MARCA</small><strong>{brand}</strong></span>,
        element,
      );
    })}
    {detailPortal}
  </>;
}
