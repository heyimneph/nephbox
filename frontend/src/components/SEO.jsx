import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
            {/* Open Graph tags for social sharing */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
};

export default SEO;
