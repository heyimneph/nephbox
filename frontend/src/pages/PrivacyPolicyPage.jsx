import React from 'react';
import styles from './PrivacyPolicyPage.module.css';
import PageWrapper from '../components/PageWrapper';
import PageTitle from '../components/PageTitle';

export default function PrivacyPolicyPage() {
    return (
        <PageWrapper>
            <PageTitle>Privacy Policy</PageTitle>
            <p className={styles['policy-date']}>Last updated: 05/03/2024</p>
            <div className={styles['policy-body']}>
                <p>
                    Nephbox values your privacy. This policy explains how we collect, use, and protect the personal
                    information you share with us.
                </p>

                <h2>What We Collect</h2>
                <p>
                    We only collect the information you choose to give us—such as your email address and, optionally,
                    your name—when you contact us through our website or Discord for commissions. We do <strong>not</strong>
                    collect your IP address, purchase history, or any other personal information.
                </p>

                <h2>How We Use Your Information</h2>
                <p>
                    We use your information solely to respond to your inquiries, communicate about services, and provide
                    important updates about Nephbox. We will <strong>never</strong> use your email for unrelated purposes
                    without your consent.
                </p>

                <h2>Keeping Your Data Secure</h2>
                <p>
                    We take reasonable steps to protect the information you provide. However, please remember that no
                    method of data transmission or storage is 100% secure.
                </p>

                <h2>Policy Updates</h2>
                <p>
                    We may update this Privacy Policy from time to time. All changes will be posted on this page.
                </p>

                <h2>Your Rights & Contact</h2>
                <p>
                    You have the right to access, correct, amend, or delete any personal information we hold about you.
                    To do so, just email us at <a href="mailto:support@nephbox.net">support@nephbox.net</a>.
                </p>

            </div>
        </PageWrapper>
    );
}
