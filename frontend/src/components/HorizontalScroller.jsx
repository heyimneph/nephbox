import React, { useState, useEffect } from "react";
import styles from "./HorizontalScroller.module.css";

const ArrowIcon = ({ direction = "right" }) => (
    <svg width="28" height="28" viewBox="0 0 22 22"
         style={{ transform: direction === "left" ? "scaleX(-1)" : undefined, display: "block" }}>
        <path d="M6 11h10m0 0l-4-4m4 4l-4 4"
              stroke="#8e63f3"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none" />
    </svg>
);

export default function HorizontalScroller({
                                               data,
                                               renderCard,
                                               gap = 24 // px
                                           }) {
    const [visibleCount, setVisibleCount] = useState(3);
    const [cardWidth, setCardWidth] = useState(260);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function updateLayout() {
            if (window.innerWidth <= 600) {
                setVisibleCount(1);
                setCardWidth(260);
                setIsMobile(true);
            } else if (window.innerWidth <= 900) {
                setVisibleCount(2);
                setCardWidth(260);
                setIsMobile(false);
            } else {
                setVisibleCount(3);
                setCardWidth(260);
                setIsMobile(false);
            }
        }
        updateLayout();
        window.addEventListener("resize", updateLayout);
        return () => window.removeEventListener("resize", updateLayout);
    }, []);

    const [startIdx, setStartIdx] = useState(0);

    useEffect(() => {
        if (startIdx + visibleCount > data.length) {
            setStartIdx(Math.max(0, data.length - visibleCount));
        }
    }, [visibleCount, data.length, startIdx]);

    const canScrollLeft = startIdx > 0;
    const canScrollRight = startIdx + visibleCount < data.length;

    const handleLeft = () => {
        if (canScrollLeft) setStartIdx(startIdx - 1);
    };
    const handleRight = () => {
        if (canScrollRight) setStartIdx(startIdx + 1);
    };

    const visibleCards = data.slice(startIdx, startIdx + visibleCount);

    const totalWidth = visibleCount * cardWidth + (visibleCount - 1) * gap;
    const showArrows = !isMobile && visibleCount > 1;

    // ---- MOBILE SWIPE/SCROLL MODE ----
    if (isMobile) {
        return (
            <div className={styles.viewportScroller}>
                <div className={styles.mobileViewport}>
                    <div className={styles.mobileCarouselRow}>
                        {data.map((item, i) => (
                            <div
                                className={styles.mobileCard}
                                key={i}
                            >
                                {renderCard(item)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    // ---- DESKTOP/TABLET PAGED CAROUSEL ----
    return (
        <div className={styles.viewportScroller}>
            {showArrows && canScrollLeft && (
                <button className={`${styles.sideArrow} ${styles.leftArrow}`} onClick={handleLeft} aria-label="Scroll left">
                    <ArrowIcon direction="left" />
                </button>
            )}
            <div
                className={styles.carouselViewport}
                style={{
                    width: `${totalWidth}px`,
                    minWidth: `${totalWidth}px`,
                    maxWidth: `${totalWidth}px`,
                }}
            >
                <div className={styles.carouselRow} style={{ gap: `${gap}px` }}>
                    {visibleCards.map((item, i) => (
                        <div
                            style={{
                                width: `${cardWidth}px`,
                                minWidth: `${cardWidth}px`,
                                maxWidth: `${cardWidth}px`
                            }}
                            key={i}
                        >
                            {renderCard(item)}
                        </div>
                    ))}
                </div>
            </div>
            {showArrows && canScrollRight && (
                <button className={`${styles.sideArrow} ${styles.rightArrow}`} onClick={handleRight} aria-label="Scroll right">
                    <ArrowIcon direction="right" />
                </button>
            )}
        </div>
    );
}
