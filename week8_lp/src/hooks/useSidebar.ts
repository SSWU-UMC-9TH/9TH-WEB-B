import { useState, useCallback, useEffect, useRef } from "react"

const DESKTOP_BREAKPOINT = 768;

interface UseSidebarProps {
    isSidebarOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

const useSidebar = (): UseSidebarProps => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isDesktopModeRef = useRef(window.innerWidth >= DESKTOP_BREAKPOINT);

    const open = useCallback(() => {
        setIsSidebarOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    const toggle = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);
    
    const handleResize = useCallback(() => {
        const currentIsDesktopMode = window.innerWidth >= DESKTOP_BREAKPOINT;

        if (currentIsDesktopMode !== isDesktopModeRef.current) {
            if (currentIsDesktopMode) {
                open();
            } 
            else {
                close();
            }
            
            isDesktopModeRef.current = currentIsDesktopMode;
        }
    }, [open, close]);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        
        if (isDesktopModeRef.current) {
            open();
        } else {
            close();
        }
        window.addEventListener('resize', handleResize);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                close();
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [handleResize, open, close]);

    return { isSidebarOpen, open, close, toggle }
}

export default useSidebar;