import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FavoritesProvider } from "./features/favorites/FavoritesProvider";
import {
  ReferenceAdminDashboard,
  ReferenceAuthPage,
  ReferenceBasketPage,
  ReferenceFavoritesPage,
  ReferenceHome,
  ReferenceInfoPage,
  ReferenceMerchantDashboard,
  ReferenceMerchantPage,
  ReferenceNotFound,
  ReferenceProductPage,
  ReferenceSearchPage,
  ReferenceStorePage,
  ReferenceStoresPage,
} from "./reference/ReferenceExperience";

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <a className="pc-skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
        <Routes>
          <Route path="/" element={<ReferenceHome />} />
          <Route path="/buscar" element={<ReferenceSearchPage />} />
          <Route path="/produto/:identifier" element={<ReferenceProductPage />} />
          <Route path="/estabelecimentos" element={<ReferenceStoresPage />} />
          <Route path="/estabelecimento/:identifier" element={<ReferenceStorePage />} />
          <Route path="/loja/:identifier" element={<ReferenceStorePage />} />
          <Route path="/cesta" element={<ReferenceBasketPage />} />
          <Route path="/cesta-basica" element={<ReferenceBasketPage />} />
          <Route path="/favoritos" element={<ReferenceFavoritesPage />} />
          <Route path="/login" element={<ReferenceAuthPage mode="login" />} />
          <Route path="/cadastro" element={<ReferenceAuthPage mode="register" />} />
          <Route path="/registrar" element={<ReferenceAuthPage mode="register" />} />
          <Route path="/lojista" element={<ReferenceMerchantPage />} />
          <Route path="/painel-lojista/*" element={<ReferenceMerchantDashboard />} />
          <Route path="/admin/*" element={<ReferenceAdminDashboard />} />
          <Route path="/colaborar" element={<ReferenceInfoPage kind="collaborate" />} />
          <Route path="/contato" element={<ReferenceInfoPage kind="contact" />} />
          <Route path="/fale-conosco" element={<ReferenceInfoPage kind="contact" />} />
          <Route path="/farmacias" element={<ReferenceInfoPage kind="pharmacies" />} />
          <Route path="/meus-pedidos" element={<ReferenceInfoPage kind="orders" />} />
          <Route path="/cultura/*" element={<ReferenceInfoPage kind="culture" />} />
          <Route path="/fremix-producoes" element={<ReferenceInfoPage kind="culture" />} />
          <Route path="/autora/*" element={<ReferenceInfoPage kind="culture" />} />
          <Route path="/dorinha-barroso" element={<ReferenceInfoPage kind="culture" />} />
          <Route path="*" element={<ReferenceNotFound />} />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}
