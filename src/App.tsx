import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { FooterDeveloperInfo } from "./components/FooterDeveloperInfo";
import { ProductCardQuickActions } from "./components/ProductCardQuickActions";
import { ProductManufacturerDetails } from "./components/ProductManufacturerDetails";
import { UserAccountHub, UserAccountPage } from "./components/UserAccountExperience";
import { AdminLoginRedirect } from "./components/AdminLoginRedirect";
import { AdminProductEditorOverlay } from "./components/AdminProductEditorOverlay";
import { AdminVideoQuickAccess } from "./components/AdminVideoQuickAccess";
import { SeoRouteManager } from "./components/SeoRouteManager";
import { HomeSmartBasketSpotlight } from "./components/HomeSmartBasketSpotlight";
import { MobileQuickNav } from "./components/MobileQuickNav";
import { AdminMaintenanceControl, PlatformMaintenanceGate } from "./components/PlatformMaintenance";
import { FavoritesProvider } from "./features/favorites/FavoritesProvider";
import { ReferenceAuthPage, ReferenceFavoritesPage, ReferenceHome, ReferenceInfoPage, ReferenceMerchantDashboard, ReferenceNotFound, ReferenceStoresPage } from "./reference/ReferenceExperience";
import { SearchDiscovery2026 } from "./reference/SearchDiscovery2026";
import { ProductDetailProfessional } from "./reference/ProductDetailProfessional";
import { StoreDetailProfessional } from "./reference/StoreDetailProfessional";
import { CulturalProfilePage } from "./reference/CulturalProfilePage";
import { MarketplaceSectorLanding, marketplaceSectors } from "./reference/MarketplaceSectors";
import { SectorHub2026 } from "./reference/SectorHub2026";
import { MerchantOnboarding } from "./reference/MerchantOnboarding";
import { AdminControlCenter } from "./reference/AdminControlCenter";
import { AdminCatalogWorkspace, AdminEnvironmentsPage } from "./reference/AdminCatalogWorkspace";
import { AdminVideoStudio } from "./reference/AdminVideoStudio";
import { SmartBasketPage } from "./reference/SmartBasketPage";
import { ProfessionalBasketPage } from "./reference/ProfessionalBasketPage";
import "./reference/FooterSignatureRefinement.css";
import "./reference/FavoritesAndSectorStability.css";
import "./reference/ExploreViewportFit.css";
import "./reference/AdminCatalogWorkspaceEnhancements.css";
import "./reference/AdminPerformance.css";
import "./reference/MobileProfessionalRefinement.css";
import "./reference/ImpeccableGlobalRefinement.css";
import "./reference/MobileSearchStability.css";
import "./reference/MobileHomepageCompactFinal.css";
import "./reference/HomeVisualIdentity2026.css";
import "./reference/MobileProMax2026.css";
import "./reference/MobileVisualRefresh2026.css";
import "./reference/SectorProfessional2026.css";
import "./reference/ProductDetailProfessional2026.css";
import "./reference/PublicExperienceFinal2026.css";
import "./reference/SearchMobileRequest2026.css";

function RouteFocusManager(){const location=useLocation();useEffect(()=>{if(location.pathname.startsWith('/admin'))return;const main=document.querySelector<HTMLElement>("#conteudo-principal, main");if(!main)return;if(!main.id)main.id="conteudo-principal";main.setAttribute("tabindex","-1");window.scrollTo({top:0,left:0,behavior:"auto"});window.requestAnimationFrame(()=>main.focus({preventScroll:true}));},[location.pathname]);return null;}
export default function App(){return <BrowserRouter><FavoritesProvider><a className="pc-skip-link" href="#conteudo-principal">Pular para o conteúdo</a><SeoRouteManager/><RouteFocusManager/><AdminLoginRedirect/><AdminProductEditorOverlay/><AdminMaintenanceControl/><AdminVideoQuickAccess/><ProductCardQuickActions/><ProductManufacturerDetails/><FooterDeveloperInfo/><UserAccountHub/><HomeSmartBasketSpotlight/><MobileQuickNav/><PlatformMaintenanceGate><Routes>
<Route path="/" element={<ReferenceHome/>}/><Route path="/buscar" element={<SearchDiscovery2026/>}/><Route path="/explorar" element={<SectorHub2026/>}/><Route path="/mercados" element={<MarketplaceSectorLanding sector={marketplaceSectors[0]}/>}/><Route path="/farmacias" element={<MarketplaceSectorLanding sector={marketplaceSectors[1]}/>}/><Route path="/padarias" element={<MarketplaceSectorLanding sector={marketplaceSectors[2]}/>}/><Route path="/livros" element={<MarketplaceSectorLanding sector={marketplaceSectors[3]}/>}/><Route path="/servicos" element={<MarketplaceSectorLanding sector={marketplaceSectors[4]}/>}/>
<Route path="/produto/:identifier" element={<ProductDetailProfessional/>}/><Route path="/estabelecimentos" element={<ReferenceStoresPage/>}/><Route path="/estabelecimento/:identifier" element={<StoreDetailProfessional/>}/><Route path="/loja/:identifier" element={<StoreDetailProfessional/>}/><Route path="/cesta" element={<ProfessionalBasketPage/>}/><Route path="/cesta-basica" element={<ProfessionalBasketPage/>}/><Route path="/cesta-inteligente" element={<SmartBasketPage/>}/><Route path="/favoritos" element={<ReferenceFavoritesPage/>}/><Route path="/minha-conta" element={<UserAccountPage/>}/>
<Route path="/login" element={<ReferenceAuthPage mode="login"/>}/><Route path="/cadastro" element={<ReferenceAuthPage mode="register"/>}/><Route path="/registrar" element={<ReferenceAuthPage mode="register"/>}/><Route path="/lojista" element={<MerchantOnboarding/>}/><Route path="/cadastro-lojista" element={<MerchantOnboarding/>}/><Route path="/quero-vender" element={<MerchantOnboarding/>}/><Route path="/painel-lojista/*" element={<ReferenceMerchantDashboard/>}/><Route path="/admin/catalogo" element={<AdminCatalogWorkspace/>}/><Route path="/admin/ambientes" element={<AdminEnvironmentsPage/>}/><Route path="/admin/videos" element={<AdminVideoStudio/>}/><Route path="/admin/*" element={<AdminControlCenter/>}/>
<Route path="/colaborar" element={<ReferenceInfoPage kind="collaborate"/>}/><Route path="/contato" element={<ReferenceInfoPage kind="contact"/>}/><Route path="/fale-conosco" element={<ReferenceInfoPage kind="contact"/>}/><Route path="/meus-pedidos" element={<ReferenceInfoPage kind="orders"/>}/><Route path="/cultura/*" element={<ReferenceInfoPage kind="culture"/>}/><Route path="/fremix-producoes" element={<CulturalProfilePage kind="fremix"/>}/><Route path="/autora/*" element={<CulturalProfilePage kind="dorinha"/>}/><Route path="/dorinha-barroso" element={<CulturalProfilePage kind="dorinha"/>}/><Route path="*" element={<ReferenceNotFound/>}/>
</Routes></PlatformMaintenanceGate></FavoritesProvider></BrowserRouter>}
