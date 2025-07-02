// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';
import PageWrapper from '../components/PageWrapper';
import PageTitle from '../components/PageTitle';

export default function NotFoundPage() {
    return (
        <PageWrapper>
            <div className={styles['notfound-container']}>
                <PageTitle>404</PageTitle>
                <h2 className={styles['notfound-heading']}>Page Not Found</h2>
                <p className={styles['notfound-text']}>
                    Oops! The page you’re looking for doesn’t exist or was moved.
                </p>
                <Link to="/" className={styles['notfound-link']}>
                    ← Back to Home
                </Link>
            </div>
        </PageWrapper>
    );
}
