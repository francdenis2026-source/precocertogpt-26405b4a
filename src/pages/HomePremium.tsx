import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  HeartPulse,
  MapPin,
  Menu,
  Moon,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Store,
  Sun,
  Tag,
  TrendingDown,
  X,
  Zap,
} from "lucide-react";
import { buildCatalog, type CatalogPayload, type Product, verifiedDatasetMetrics } from "../data/catalog";
import { fetchCatalog } from "../data/remoteCatalog";
import { resolveProductImage } from "../data/productImageResolver";
import { suggestProducts } from "../lib/productSearch";
import "./HomePremium.css";

type Theme = "light" | "dark";

const initialCatalog = buildCatalog();
const popularSearches = ["Arroz", "Café", "Leite", "Carne", "Limpeza"];
const categories = [
  { name: "Mercados", description: "Cesta básica e dia a dia", icon: ShoppingBasket, query: "mercado", tone: "blue" },
  { name: "Açougues", description: "Carnes e cortes", icon: Tag, query: "carne", tone: "orange" },
  { name: "Farmácias", description: "Saúde e cuidados", icon: HeartPulse, href: "/farmacias", tone: "pink" },
  { name: "Livros locais", description: "Autores de Feijó", icon: BookOpen, href: "/dorinha-barroso", tone: "violet" },
] as const;

const money = (value: number) => new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
}).format(value);

const readTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem("theme") === "dark" ? "dark" : "light";
};

function bestOffer(product: Product) {
  return [...(product.offers ?? [])]
    .filter((offer) => Number.isFinite(offer.value) && offer.value > 0)
    .sort((a, b) => a.value - b.value)[0] ?? {
      establishmentId: product.establishmentId,
      establishmentSlug: product.establishmentSlug,
      establishment: product.establishment,
      neighborhood: product.neighborhood,
      storeColor: product.storeColor,
      value: product.minPrice,
      capturedAt: product.capturedAt,
    };
}

export function HomePremium() {
  const navigate = useNavigate();
  const searchAreaRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(-1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [catalog, setCatalog] = useState<CatalogPayload>({
    products: initialCatalog.products,
    stores: initialCatalog.stores,
    metrics: verifiedDatasetMetrics,
    updatedAt: initialCatalog.updatedAt,
  });
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;
    fetchCatalog()
      .then((result) => { if (active) setCatalog(result); })
      .catch(() => undefined)
      .finally(() => { if (active) setCatalogLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const closeSearch = (event: PointerEvent) => {
      if (!searchAreaRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
        setActiveResult(-1);
      }
    };
    document.addEventListener("pointerdown", closeSearch);
    return () => document.removeEventListener("pointerdown", closeSearch);
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    dialogTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 0);

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      dialogTriggerRef.current?.focus();
    };
  }, [selectedProduct]);

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];
    return suggestProducts(catalog.products, query, 6).filter((product) => product.minPrice > 0);
  }, [catalog.products, query]);

  const opportunities = useMemo(() => catalog.products
    .filter((product) => product.minPrice > 0)
    .sort((a, b) => (b.maxPrice - b.minPrice) - (a.maxPrice - a.minPrice))
    .slice(0, 6), [catalog.products]);

  const comparisonProduct = opportunities[0] ?? catalog.products[0];
  const comparisonOffers = useMemo(() => comparisonProduct
    ? [...(comparisonProduct.offers ?? [])]
      .filter((offer) => offer.value > 0)
      .sort((a, b) => a.value - b.value)
      .slice(0, 4)
    : [], [comparisonProduct]);
  const stores = useMemo(() => catalog.stores.filter((store) => store.products > 0).slice(0, 6), [catalog.stores]);
  const headlineSaving = comparisonProduct ? Math.max(0, comparisonProduct.maxPrice - comparisonProduct.minPrice) : 0;

  const search = (term: string) => {
    const normalized = term.trim();
    navigate(normalized ? `/buscar?q=${encodeURIComponent(normalized)}` : "/buscar");
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selected = activeResult >= 0 ? suggestions[activeResult] : undefined;
    if (selected) {
      setSelectedProduct(selected);
      setSearchOpen(false);
      return;
    }
    search(query);
  };

  const handleSearchKeys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setSearchOpen(false);
      setActiveResult(-1);
      return;
    }
    if (!searchOpen || !suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveResult((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveResult((current) => current <= 0 ? suggestions.length - 1 : current - 1);
    } else if (event.key === "Enter" && activeResult >= 0) {
      event.preventDefault();
      setSelectedProduct(suggestions[activeResult]);
      setSearchOpen(false);
    }
  };

  return (
    <div className="pcx-home">
      <a className="pcx-skip" href="#conteudo">Ir para o conteúdo</a>

      <header className="pcx-header">
        <div className="pcx-shell pcx-header__inner">
          <Link className="pcx-brand" to="/" aria-label="PreçoCerto — página inicial">
            <span className="pcx-brand__mark"><TrendingDown aria-hidden="true" /></span>
            <span>preço<strong>certo</strong></span>
          </Link>
          <nav className="pcx-nav" aria-label="Navegação principal">
            <Link to="/buscar">Comparar</Link>
            <Link to="/estabelecimentos">Lojas locais</Link>
            <Link to="/farmacias">Farmácias</Link>
            <Link to="/colaborar">Colaborar</Link>
          </nav>
          <div className="pcx-header__actions">
            <button className="pcx-icon-button" type="button" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}>
              {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
            <Link className="pcx-merchant" to="/lojista">Área do lojista <ArrowRight aria-hidden="true" /></Link>
            <button className="pcx-menu-button" type="button" aria-expanded={menuOpen} aria-controls="pcx-mobile-menu" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen((value) => !value)}>
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="pcx-mobile-menu" className="pcx-mobile-menu" aria-label="Navegação mobile">
            <Link to="/buscar" onClick={() => setMenuOpen(false)}>Comparar preços</Link>
            <Link to="/estabelecimentos" onClick={() => setMenuOpen(false)}>Lojas locais</Link>
            <Link to="/farmacias" onClick={() => setMenuOpen(false)}>Farmácias</Link>
            <Link to="/colaborar" onClick={() => setMenuOpen(false)}>Colaborar</Link>
            <Link to="/lojista" onClick={() => setMenuOpen(false)}>Área do lojista</Link>
          </nav>
        )}
      </header>

      <main id="conteudo">
        <section className="pcx-hero" aria-labelledby="pcx-title">
          <div className="pcx-shell pcx-hero__grid">
            <div className="pcx-hero__copy">
              <div className="pcx-eyebrow"><Zap aria-hidden="true" /> Inteligência de preços para Feijó</div>
              <h1 id="pcx-title">Seu dinheiro compra <em>mais</em> quando você compara.</h1>
              <p>Veja o preço do mesmo produto em diferentes lojas da cidade e escolha onde vale a pena comprar — antes de sair de casa.</p>

              <div className="pcx-search-area" ref={searchAreaRef}>
                <form className="pcx-search" role="search" onSubmit={submitSearch}>
                  <label htmlFor="pcx-search-input">O que você quer comprar?</label>
                  <div className="pcx-search__control">
                    <Search aria-hidden="true" />
                    <input
                      id="pcx-search-input"
                      value={query}
                      onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); setActiveResult(-1); }}
                      onFocus={() => setSearchOpen(true)}
                      onKeyDown={handleSearchKeys}
                      placeholder="Ex.: arroz, café, leite..."
                      autoComplete="off"
                      aria-autocomplete="list"
                      aria-controls="pcx-search-results"
                      aria-expanded={searchOpen && query.trim().length >= 2}
                      aria-activedescendant={activeResult >= 0 ? `pcx-result-${activeResult}` : undefined}
                    />
                    <button type="submit">Comparar agora <ArrowRight aria-hidden="true" /></button>
                  </div>
                </form>
                {searchOpen && query.trim().length >= 2 && (
                  <div id="pcx-search-results" className="pcx-results" role="listbox" aria-label="Sugestões de produtos">
                    {suggestions.length ? suggestions.map((product, index) => (
                      <button
                        id={`pcx-result-${index}`}
                        key={`${product.id}-${product.establishmentId}`}
                        type="button"
                        role="option"
                        aria-selected={activeResult === index}
                        className={activeResult === index ? "is-active" : ""}
                        onPointerDown={(event) => event.preventDefault()}
                        onClick={() => { setSelectedProduct(product); setSearchOpen(false); }}
                      >
                        <span className="pcx-result__image">
                          {resolveProductImage(product) ? <img src={resolveProductImage(product)} alt="" /> : <PackageSearch aria-hidden="true" />}
                        </span>
                        <span><strong>{product.name}</strong><small>{product.brand} · {product.size}</small></span>
                        <span className="pcx-result__price"><small>a partir de</small><strong>{money(product.minPrice)}</strong></span>
                      </button>
                    )) : <div className="pcx-results__empty"><PackageSearch aria-hidden="true" /><span><strong>Nenhum resultado para “{query}”</strong><small>Tente buscar por arroz, leite ou limpeza.</small></span></div>}
                  </div>
                )}
                <div className="pcx-quick" aria-label="Buscas populares">
                  <span>Mais buscados:</span>
                  {popularSearches.map((term) => <button key={term} type="button" onClick={() => search(term)}>{term}</button>)}
                </div>
              </div>
            </div>

            <aside className="pcx-radar" aria-label="Exemplo de comparação em tempo real">
              <div className="pcx-radar__top">
                <span><Sparkles aria-hidden="true" /> Radar de economia</span>
                <span className="pcx-live"><i /> Atualizado</span>
              </div>
              {comparisonProduct ? (
                <>
                  <div className="pcx-radar__product">
                    <div className="pcx-radar__image">
                      {resolveProductImage(comparisonProduct) ? <img src={resolveProductImage(comparisonProduct)} alt={comparisonProduct.name} /> : <ShoppingBasket aria-hidden="true" />}
                    </div>
                    <div><small>Melhor oportunidade agora</small><h2>{comparisonProduct.name}</h2><p>{comparisonProduct.brand} · {comparisonProduct.size}</p></div>
                  </div>
                  <div className="pcx-radar__prices">
                    <div><span>Menor preço</span><strong>{money(comparisonProduct.minPrice)}</strong></div>
                    <div><span>Maior preço</span><strong>{money(comparisonProduct.maxPrice)}</strong></div>
                  </div>
                  <div className="pcx-radar__saving"><TrendingDown aria-hidden="true" /><span>Você pode economizar</span><strong>{money(headlineSaving)}</strong></div>
                  <button type="button" onClick={() => setSelectedProduct(comparisonProduct)}>Ver comparação completa <ChevronRight aria-hidden="true" /></button>
                </>
              ) : <div className="pcx-radar__loading">Carregando comparação...</div>}
            </aside>
          </div>
        </section>

        <section className="pcx-proof" aria-label="Números da plataforma">
          <div className="pcx-shell pcx-proof__grid">
            <div><strong>{catalogLoading ? "—" : catalog.metrics.products.toLocaleString("pt-BR")}</strong><span>produtos monitorados</span></div>
            <div><strong>{catalogLoading ? "—" : catalog.metrics.prices.toLocaleString("pt-BR")}</strong><span>preços comparados</span></div>
            <div><strong>{catalogLoading ? "—" : catalog.metrics.stores.toLocaleString("pt-BR")}</strong><span>estabelecimentos locais</span></div>
            <div className="pcx-proof__trust"><ShieldCheck aria-hidden="true" /><span><strong>Dados transparentes</strong><small>Você decide onde comprar</small></span></div>
          </div>
        </section>

        <section className="pcx-section pcx-shell" aria-labelledby="categorias-title">
          <div className="pcx-section__head">
            <div><span className="pcx-kicker">Explore a cidade</span><h2 id="categorias-title">Tudo o que você precisa, mais perto.</h2></div>
            <Link to="/buscar">Ver todas as categorias <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="pcx-categories">
            {categories.map((category) => {
              const Icon = category.icon;
              const content = <><span className={`pcx-category__icon is-${category.tone}`}><Icon aria-hidden="true" /></span><span><strong>{category.name}</strong><small>{category.description}</small></span><ChevronRight aria-hidden="true" /></>;
              return "href" in category
                ? <Link key={category.name} className="pcx-category" to={category.href}>{content}</Link>
                : <button key={category.name} className="pcx-category" type="button" onClick={() => search(category.query)}>{content}</button>;
            })}
          </div>
        </section>

        <section className="pcx-section pcx-opportunities" aria-labelledby="oportunidades-title">
          <div className="pcx-shell">
            <div className="pcx-section__head">
              <div><span className="pcx-kicker">Diferenças que importam</span><h2 id="oportunidades-title">Onde seu dinheiro rende mais hoje.</h2><p>Produtos com maior variação de preço entre as lojas.</p></div>
              <Link to="/buscar">Comparar mais produtos <ArrowRight aria-hidden="true" /></Link>
            </div>
            <div className="pcx-products">
              {opportunities.map((product, index) => {
                const saving = Math.max(0, product.maxPrice - product.minPrice);
                return (
                  <button key={`${product.id}-${index}`} className="pcx-product" type="button" onClick={() => setSelectedProduct(product)}>
                    <span className="pcx-product__badge">Economize {money(saving)}</span>
                    <span className="pcx-product__media">
                      {resolveProductImage(product) ? <img src={resolveProductImage(product)} alt={product.name} loading={index > 2 ? "lazy" : "eager"} /> : <PackageSearch aria-hidden="true" />}
                    </span>
                    <span className="pcx-product__body">
                      <small>{product.category}</small><strong>{product.name}</strong><span>{product.brand} · {product.size}</span>
                      <span className="pcx-product__price"><small>a partir de</small><b>{money(product.minPrice)}</b></span>
                      <span className="pcx-product__store"><MapPin aria-hidden="true" /> {bestOffer(product).establishment}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {comparisonProduct && (
          <section className="pcx-compare" aria-labelledby="comparacao-title">
            <div className="pcx-shell pcx-compare__grid">
              <div className="pcx-compare__copy">
                <span className="pcx-kicker">Comparação sem enrolação</span>
                <h2 id="comparacao-title">O mesmo produto.<br />Preços bem diferentes.</h2>
                <p>O PreçoCerto organiza os valores encontrados para você enxergar rapidamente a melhor escolha.</p>
                <ul><li><Check aria-hidden="true" /> Preços lado a lado</li><li><Check aria-hidden="true" /> Loja e bairro identificados</li><li><Check aria-hidden="true" /> Atualização transparente</li></ul>
                <Link to={`/buscar?q=${encodeURIComponent(comparisonProduct.name)}`}>Abrir comparação <ArrowRight aria-hidden="true" /></Link>
              </div>
              <div className="pcx-compare__card">
                <div className="pcx-compare__product"><BarChart3 aria-hidden="true" /><span><small>Comparando agora</small><strong>{comparisonProduct.name}</strong></span></div>
                <div className="pcx-offers">
                  {(comparisonOffers.length ? comparisonOffers : [bestOffer(comparisonProduct)]).map((offer, index) => (
                    <div key={`${offer.establishmentId}-${index}`} className={index === 0 ? "is-best" : ""}>
                      <span className="pcx-offer__rank">{index + 1}</span>
                      <span><strong>{offer.establishment}</strong><small><MapPin aria-hidden="true" /> {offer.neighborhood}</small></span>
                      {index === 0 && <em><BadgeCheck aria-hidden="true" /> Melhor preço</em>}
                      <b>{money(offer.value)}</b>
                    </div>
                  ))}
                </div>
                <div className="pcx-compare__footer"><Clock3 aria-hidden="true" /> Preços informados pelas lojas e colaboradores locais.</div>
              </div>
            </div>
          </section>
        )}

        <section className="pcx-section pcx-shell" aria-labelledby="lojas-title">
          <div className="pcx-section__head">
            <div><span className="pcx-kicker">Comércio local conectado</span><h2 id="lojas-title">Boas escolhas começam por perto.</h2></div>
            <Link to="/estabelecimentos">Conhecer todas as lojas <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="pcx-stores">
            {stores.map((store) => (
              <Link className="pcx-store" to={`/estabelecimento/${store.slug}`} key={store.id}>
                <span className="pcx-store__mark" style={{ "--store-color": store.color } as CSSProperties}><Store aria-hidden="true" /></span>
                <span><strong>{store.name}</strong><small><MapPin aria-hidden="true" /> {store.neighborhood}</small></span>
                <span className="pcx-store__count">{store.products} itens</span><ChevronRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="pcx-steps" aria-labelledby="como-title">
          <div className="pcx-shell">
            <div className="pcx-steps__head"><span className="pcx-kicker">Simples de verdade</span><h2 id="como-title">Compare em três passos.</h2></div>
            <div className="pcx-steps__grid">
              <div><span>01</span><Search aria-hidden="true" /><h3>Busque o produto</h3><p>Digite o nome, a marca ou a categoria do que precisa.</p></div>
              <div><span>02</span><BarChart3 aria-hidden="true" /><h3>Compare os preços</h3><p>Veja os valores encontrados nas lojas da cidade.</p></div>
              <div><span>03</span><MapPin aria-hidden="true" /><h3>Escolha onde comprar</h3><p>Decida considerando preço, bairro e conveniência.</p></div>
            </div>
          </div>
        </section>

        <section className="pcx-business">
          <div className="pcx-shell pcx-business__grid">
            <div><span className="pcx-eyebrow"><Store aria-hidden="true" /> Para comerciantes</span><h2>Sua loja na rota de quem quer comprar melhor.</h2><p>Divulgue seus produtos, mantenha preços atualizados e seja encontrado por clientes de toda Feijó.</p></div>
            <div className="pcx-business__actions"><Link to="/lojista">Cadastrar minha loja <ArrowRight aria-hidden="true" /></Link><Link to="/estabelecimentos">Ver vitrine local</Link></div>
          </div>
        </section>
      </main>

      {selectedProduct && (
        <div className="pcx-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}>
          <section ref={dialogRef} className="pcx-dialog" role="dialog" aria-modal="true" aria-labelledby="pcx-dialog-title">
            <button ref={closeRef} className="pcx-dialog__close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Fechar detalhes"><X aria-hidden="true" /></button>
            <div className="pcx-dialog__media">
              {resolveProductImage(selectedProduct) ? <img src={resolveProductImage(selectedProduct)} alt={selectedProduct.name} /> : <PackageSearch aria-hidden="true" />}
            </div>
            <div className="pcx-dialog__content">
              <span className="pcx-kicker">Comparação de preços</span>
              <h2 id="pcx-dialog-title">{selectedProduct.name}</h2>
              <p>{selectedProduct.brand} · {selectedProduct.size} · {selectedProduct.category}</p>
              <div className="pcx-dialog__summary"><div><small>Menor preço</small><strong>{money(selectedProduct.minPrice)}</strong></div><div><small>Preço médio</small><strong>{money(selectedProduct.avgPrice)}</strong></div><div><small>Diferença</small><strong>{money(Math.max(0, selectedProduct.maxPrice - selectedProduct.minPrice))}</strong></div></div>
              <div className="pcx-dialog__offers">
                {([...(selectedProduct.offers ?? [])].sort((a, b) => a.value - b.value).slice(0, 5).length
                  ? [...(selectedProduct.offers ?? [])].sort((a, b) => a.value - b.value).slice(0, 5)
                  : [bestOffer(selectedProduct)]).map((offer, index) => (
                    <div key={`${offer.establishmentId}-${index}`}><span><strong>{offer.establishment}</strong><small><MapPin aria-hidden="true" /> {offer.neighborhood}</small></span>{index === 0 && <em>Melhor preço</em>}<b>{money(offer.value)}</b></div>
                  ))}
              </div>
              <div className="pcx-dialog__actions"><Link to={`/buscar?q=${encodeURIComponent(selectedProduct.name)}`}>Ver página de comparação <ArrowRight aria-hidden="true" /></Link><button type="button" onClick={() => setSelectedProduct(null)}>Continuar navegando</button></div>
            </div>
          </section>
        </div>
      )}

      <footer className="pcx-footer">
        <div className="pcx-shell pcx-footer__top">
          <Link className="pcx-brand" to="/"><span className="pcx-brand__mark"><TrendingDown aria-hidden="true" /></span><span>preço<strong>certo</strong></span></Link>
          <p>Informação local para escolhas mais inteligentes.</p>
          <nav aria-label="Links do rodapé"><Link to="/buscar">Comparar</Link><Link to="/estabelecimentos">Lojas</Link><Link to="/colaborar">Colaborar</Link><Link to="/fale-conosco">Contato</Link></nav>
        </div>
        <div className="pcx-shell pcx-footer__bottom"><span>© 2026 PreçoCerto</span><span>Feito em Feijó, Acre.</span></div>
      </footer>
    </div>
  );
}
