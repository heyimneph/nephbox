// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SEO from './components/SEO';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import { ScrollToSectionProvider } from './context/ScrollToSectionContext';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import FileConverter from './pages/FileConverter';
import UrlShortener from './pages/UrlShortener';
import JsonFormatter from './pages/JsonFormatter';
import DeckPriceLookup from './pages/YugiohPage';
import MarkdownPreviewer from './pages/MarkdownPreviewer';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ShopUnavailable from "./pages/ShopUnavailable";
import ThankYouPage from './pages/ThankYouPage';
import NotFoundPage from './pages/NotFoundPage';
import ChatWidget from './components/ChatWidget';

import './App.css';

function App() {
    return (
        <ScrollToSectionProvider>
            <Router>
                <SEO
                    title="nephbox"
                    description="Scalable backend systems, bots, APIs, and infrastructure built with Python, Flask, Docker and more."
                />
                <ScrollToTop />
                <div className="app-root">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/services" element={<ServicesPage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/webapps/file-converter" element={<FileConverter />} />
                            <Route path="/webapps/url-shortener" element={<UrlShortener />} />
                            <Route path="/webapps/json-formatter" element={<JsonFormatter />} />
                            <Route path="/webapps/markdown-previewer" element={<MarkdownPreviewer />} />
                            <Route path="/webapps/deck-price-lookup" element={<DeckPriceLookup />} />
                            <Route path="/thank-you" element={<ThankYouPage />} />
                            <Route path="/shop-unavailable" element={<ShopUnavailable />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </main>
                    <CookieBanner />
                    <Footer />
                    <ChatWidget />
                </div>
            </Router>
        </ScrollToSectionProvider>
    );
}

export default App;
