import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Building2, Factory } from "lucide-react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

type ProductIdentity = {
  brand: string | null;
  manufacturer: string | null;
};

const clean = (value: string | null | undefined) => {
  const text = (value || "").trim();
  return text && text !== "-" && text !== "—" ? text : "";
};

export function ProductManufacturerDetails() {
  const location = useLocation();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [identity, setIdentity] = useState<ProductIdentity | null>(null);

  useEffect(() => {
    const match = location.pathname.match(/^\/produto\/([^/?#]+)/);
    if (!match) {
      setTarget(null);
      setIdentity(null);
      return;
    }

    const identifier = decodeURIComponent(match[1]);
    let active = true;
    let observer: MutationObserver | null = null;

    const findTarget = () => {
      const node = document.querySelector<HTMLElement>(".pdp-meta");
      if (node && active) setTarget(node);
      return Boolean(node);
    };

    if (!findTarget()) {
      observer = new MutationObserver(() => {
        if (findTarget()) observer?.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    const load = async () => {
      if (!supabase) return;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
      const query = supabase.from("products").select("brand, manufacturer");
      const response = isUuid
        ? await query.eq("id", identifier).maybeSingle()
        : await query.eq("slug", identifier).maybeSingle();
      if (active && !response.error && response.data) setIdentity(response.data as ProductIdentity);
    };

    void load();
    return () => {
      active = false;
      observer?.disconnect();
    };
  }, [location.pathname]);

  if (!target || !identity) return null;

  const brand = clean(identity.brand);
  const manufacturer = clean(identity.manufacturer);

  return createPortal(<>
    <div className="pdp-brand-detail">
      <Building2 aria-hidden="true" />
      <span><small>Marca</small><strong>{brand || "Não informada"}</strong></span>
    </div>
    <div className="pdp-manufacturer-detail">
      <Factory aria-hidden="true" />
      <span><small>Fabricante</small><strong>{manufacturer || "Não informado"}</strong></span>
    </div>
  </>, target);
}
