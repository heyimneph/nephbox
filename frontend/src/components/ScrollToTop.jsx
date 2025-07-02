import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.querySelector('.main-content')?.scrollTo({ top: 0 });
        document.querySelector('.app-root')?.scrollTo?.({ top: 0 });
        document.getElementById('root')?.scrollTo?.({ top: 0 });
        document.body.scrollTop = 0;
    }, [pathname]);

    return null;
}
