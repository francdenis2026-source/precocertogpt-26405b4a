import "./performance/disableClientImageProcessing";
import "./performance/tolerantDomMutations";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrecoCertoApp from "./PrecoCertoApp";
import { MaxPriceStoreLabels } from "./components/MaxPriceStoreLabels";
import { SearchUxClarity } from "./components/SearchUxClarity";
import { SearchSafePolish } from "./components/SearchSafePolish";
import { ProductInteractionUx } from "./components/ProductInteractionUx";
import { PublicCatalogUxFixes } from "./components/PublicCatalogUxFixes";
import { PublicOnlineSalesAvailability } from "./components/PublicOnlineSalesAvailability";
import { SmartCompareSearchProMax } from "./components/SmartCompareSearchProMax";
import { HomepageSearchKeyboardProMax } from "./components/HomepageSearchKeyboardProMax";
import { HomepageAuditFixes } from "./components/HomepageAuditFixes";
import { ProductMediaClippingProMax } from "./components/ProductMediaClippingProMax";
import { HomeProductModalProMaxEnhancer } from "./components/HomeProductModalProMaxEnhancer";
import { FooterCompactUx } from "./components/FooterCompactUx";
import { GlobalMobileCompactUx } from "./components/GlobalMobileCompactUx";
import { UiUxProMaxFoundation } from "./components/UiUxProMaxFoundation";
import { ProductCardsSafePolish } from "./components/ProductCardsSafePolish";
import { ProductDetailSafePolish } from "./components/ProductDetailSafePolish";
import { EstablishmentsSafePolish } from "./components/EstablishmentsSafePolish";
import { BasketFavoritesUserSafePolish } from "./components/BasketFavoritesUserSafePolish";
import { PlansMerchantConversionSafePolish } from "./components/PlansMerchantConversionSafePolish";
import { InternalDashboardsSafePolish } from "./components/InternalDashboardsSafePolish";
import { InternalDashboardsDeepUiUx } from "./components/InternalDashboardsDeepUiUx";
import { PublicPagesUiUxAudit } from "./components/PublicPagesUiUxAudit";
import { VisualRegressionGuard } from "./components/VisualRegressionGuard";
import { GlobalPremiumExperience } from "./components/GlobalPremiumExperience";
import { DeveloperMarketplaceAbout } from "./components/DeveloperMarketplaceAbout";
import { CorePublicPagesUiUx } from "./components/CorePublicPagesUiUx";
import { ScrollPerformanceGuard } from "./components/ScrollPerformanceGuard";
import { PreferredProductPngUpgrade } from "./components/PreferredProductPngUpgrade";
import { EstablishmentsMarketplacePage } from "./components/EstablishmentsMarketplacePage";
import { EstablishmentsNavBridge } from "./components/EstablishmentsNavBridge";
import { PublicEstablishmentCatalog } from "./components/PublicEstablishmentCatalog";
import { DorinhaAuthorStoreProMax } from "./components/DorinhaAuthorStoreProMax";
import { FremixProductionsPage } from "./components/FremixProductionsPage";
import { FremixDirectoryBridge } from "./components/FremixDirectoryBridge";
import { FremixCuratedVideos } from "./components/FremixCuratedVideos";
import { BasketSessionFlow } from "./components/BasketSessionFlow";
import { AuthorMerchantDashboardWelcome } from "./components/AuthorMerchantDashboardWelcome";
import { AuthorCatalogEditor } from "./components/AuthorCatalogEditor";
import { MerchantDashboard } from "./components/MerchantDashboard";
import { MerchantBusinessSetup } from "./components/MerchantBusinessSetup";
import { MerchantBusinessSetupShortcut } from "./components/MerchantBusinessSetupShortcut";
import { MerchantDemoSwitcher } from "./components/MerchantDemoSwitcher";
import { MerchantCatalogStudio } from "./components/MerchantCatalogStudio";
import { MerchantManagementCenter } from "./components/MerchantManagementCenter";
import { MerchantOnlineSalesControl } from "./components/MerchantOnlineSalesControl";
import { MerchantOnlineStoreRoute } from "./components/MerchantOnlineStoreRoute";
import { MerchantOnboardingPage } from "./components/MerchantOnboardingPage";
import { PlatformAdminDashboard } from "./components/PlatformAdminDashboard";
import { AdminMerchantManagement } from "./components/AdminMerchantManagement";
import { CustomerOrders } from "./components/CustomerOrders";
import { MercadoPagoCallback } from "./components/MercadoPagoCallback";
import { CollaboratePage, ContactPage, PharmaciesPage } from "./components/PublicFooterServicePages";
import { HomePremium } from "./pages/HomePremium";
import { FavoritesProvider } from "./features/favorites/FavoritesProvider";
import { SavedFavoritesPage } from "./features/favorites/SavedFavoritesPage";
import { CommerceIntentBridge } from "./features/favorites/CommerceIntentBridge";
import "./components/KowalskiGlobalExperience.css";
import "./components/KowalskiLegacyDeep.css";
import "./components/ImpeccableFullSitePolish.css";
import "./components/ImpeccableStructuralLegacy.css";
import "./components/DorinhaEditorialCompactV6.css";
import "./pages/HomeVercelGuidelines2026.css";
import "./pages/HomeRebuildAllSkills2026.css";
import "./styles/TotalTheme2026.css";

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <CommerceIntentBridge />
        <VisualRegressionGuard />
        <GlobalPremiumExperience />
        <DeveloperMarketplaceAbout />
        <HomepageSearchKeyboardProMax />
        <HomepageAuditFixes />
        <ProductMediaClippingProMax />
        <HomeProductModalProMaxEnhancer />
        <CorePublicPagesUiUx />
        <ScrollPerformanceGuard />
        <MaxPriceStoreLabels />
        <SearchUxClarity />
        <SearchSafePolish />
        <ProductInteractionUx />
        <PublicCatalogUxFixes />
        <PublicOnlineSalesAvailability />
        <FooterCompactUx />
        <GlobalMobileCompactUx />
        <UiUxProMaxFoundation />
        <ProductCardsSafePolish />
        <ProductDetailSafePolish />
        <EstablishmentsSafePolish />
        <BasketFavoritesUserSafePolish />
        <PlansMerchantConversionSafePolish />
        <InternalDashboardsSafePolish />
        <InternalDashboardsDeepUiUx />
        <PublicPagesUiUxAudit />
        <PreferredProductPngUpgrade />
        <MerchantBusinessSetupShortcut />
        <MerchantDemoSwitcher />
        <EstablishmentsNavBridge />
        <FremixDirectoryBridge />
        <FremixCuratedVideos />
        <BasketSessionFlow />
        <AuthorMerchantDashboardWelcome />
        <Routes>
          <Route path="/" element={<HomePremium />} />
          <Route path="/buscar" element={<SmartCompareSearchProMax />} />
          <Route path="/favoritos" element={<SavedFavoritesPage />} />
          <Route path="/estabelecimentos" element={<EstablishmentsMarketplacePage />} />
          <Route path="/estabelecimento/dorinha-barroso-livros" element={<DorinhaAuthorStoreProMax />} />
          <Route path="/estabelecimento/:identifier" element={<PublicEstablishmentCatalog />} />
          <Route path="/cultura/fremix-producoes" element={<FremixProductionsPage />} />
          <Route path="/fremix-producoes" element={<FremixProductionsPage />} />
          <Route path="/autora/dorinha-barroso" element={<DorinhaAuthorStoreProMax />} />
          <Route path="/dorinha-barroso" element={<DorinhaAuthorStoreProMax />} />
          <Route path="/lojista" element={<MerchantOnboardingPage />} />
          <Route path="/loja/:merchantId" element={<MerchantOnlineStoreRoute />} />
          <Route path="/painel-lojista" element={<MerchantDashboard />} />
          <Route path="/painel-lojista/autora" element={<AuthorCatalogEditor />} />
          <Route path="/painel-lojista/gestao" element={<MerchantManagementCenter />} />
          <Route path="/painel-lojista/catalogo" element={<MerchantCatalogStudio />} />
          <Route path="/painel-lojista/configurar-negocio" element={<MerchantBusinessSetup />} />
          <Route path="/painel-lojista/vendas-online" element={<MerchantOnlineSalesControl />} />
          <Route path="/meus-pedidos" element={<CustomerOrders />} />
          <Route path="/integracoes/mercadopago/callback" element={<MercadoPagoCallback />} />
          <Route path="/admin/plataforma" element={<PlatformAdminDashboard />} />
          <Route path="/admin/comercios" element={<AdminMerchantManagement />} />
          <Route path="/colaborar" element={<CollaboratePage />} />
          <Route path="/fale-conosco" element={<ContactPage />} />
          <Route path="/farmacias" element={<PharmaciesPage />} />
          <Route path="*" element={<PrecoCertoApp />} />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}
