import React from "react";
import PageWrapper from "../components/PageWrapper";
import PageTitle from "../components/PageTitle";

export default function ShopUnavailable() {
    return (
        <PageWrapper>
            <PageTitle>Shop</PageTitle>
            <div style={{
                textAlign: "center",
                margin: "3rem auto",
                maxWidth: 480,
                padding: "2.5rem 1.5rem",
                background: "var(--bg-secondary)",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                boxShadow: "0 4px 18px rgba(30,24,64,0.07)"
            }}>
                <h2 style={{ color: "var(--primary-color)", marginBottom: "1.4rem" }}>Coming Soon!</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.08rem" }}>
                    The shop is not currently available.<br />
                    Please check back later or contact us for custom purchases.
                </p>
            </div>
        </PageWrapper>
    );
}
