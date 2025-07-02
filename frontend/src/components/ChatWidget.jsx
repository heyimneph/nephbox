import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';

const baseZ = 9999;
const defaultSize = { width: 340, height: 390 };
const minSize = { width: 260, height: 56 };
const maxSize = { width: 600, height: 600 };
const CHAT_ENABLED = false;

const RIGHT_MARGIN = 32;
const DEFAULT_BOTTOM_MARGIN = 32;

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [visible, setVisible] = useState(true);

    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can we help you today?' }
    ]);
    const [input, setInput] = useState('');

    const [position, setPosition] = useState({
        x: window.innerWidth - defaultSize.width - RIGHT_MARGIN,
        y: window.innerHeight - defaultSize.height - DEFAULT_BOTTOM_MARGIN
    });
    const [size, setSize] = useState(defaultSize);

    const prevPosition = useRef(position);
    const prevSize = useRef(size);

    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const chatRef = useRef(null);

    const clampPosition = (x, y, width = size.width, height = size.height) => {
        const minX = 8;
        const minY = 8;
        const maxX = window.innerWidth - width - 8;
        const maxY = window.innerHeight - height - DEFAULT_BOTTOM_MARGIN;
        return {
            x: Math.min(Math.max(x, minX), maxX),
            y: Math.min(Math.max(y, minY), maxY),
        };
    };

    const clampSize = (w, h) => ({
        width: Math.min(Math.max(w, minSize.width), maxSize.width),
        height: Math.min(Math.max(h, minSize.height), maxSize.height),
    });

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging) {
                const x = e.clientX - dragOffset.current.x;
                const y = e.clientY - dragOffset.current.y;
                setPosition(clampPosition(x, y));
            } else if (resizing) {
                const dx = e.clientX - resizeStart.current.x;
                const dy = e.clientY - resizeStart.current.y;
                const newSize = clampSize(resizeStart.current.width + dx, resizeStart.current.height + dy);
                setSize(newSize);
                setPosition(clampPosition(position.x, position.y, newSize.width, newSize.height));
            }
        };
        const handleMouseUp = () => {
            setDragging(false);
            setResizing(false);
        };

        if (dragging || resizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, resizing, position.x, position.y, size.width, size.height]);

    useEffect(() => {
        const handleResize = () => {
            setPosition((pos) => clampPosition(pos.x, pos.y, size.width, size.height));
            setSize((sz) => clampSize(sz.width, sz.height));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [size.width, size.height]);

    useEffect(() => {
        if (open && !minimized && chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, open, minimized]);

    const handleMinimize = (e) => {
        e.stopPropagation();
        if (!minimized) {
            prevPosition.current = position;
            prevSize.current = size;
            setPosition({
                x: window.innerWidth - minSize.width - RIGHT_MARGIN,
                y: window.innerHeight - minSize.height - DEFAULT_BOTTOM_MARGIN
            });
            setSize({ width: minSize.width, height: minSize.height });
            setMinimized(true);
        } else {
            setPosition(prevPosition.current);
            setSize(prevSize.current);
            setMinimized(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !CHAT_ENABLED) return;
        setMessages((prev) => [...prev, { sender: 'user', text: input }]);
        try {
            const resp = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });
            if (resp.ok) {
                setMessages((prev) => [...prev, {
                    sender: 'bot',
                    text: "We've received your message! Our team will reply soon (check Discord or email if you left one)."
                }]);
            } else {
                setMessages((prev) => [...prev, {
                    sender: 'bot',
                    text: "Sorry, we couldn't send your message. Please try again later."
                }]);
            }
        } catch (e) {
            setMessages((prev) => [...prev, {
                sender: 'bot',
                text: "Network error. Please try again later."
            }]);
        }
        setInput('');
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const startDrag = (e) => {
        if (minimized) return;
        setDragging(true);
        const rect = e.target.closest('.chat-widget-window')?.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startResize = (e) => {
        setResizing(true);
        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height,
        };
        e.stopPropagation();
        e.preventDefault();
    };

    if (!visible) return null;

    return (
        <>
            {!open && (
                <button
                    className={styles.chatButton}
                    style={{
                        bottom: DEFAULT_BOTTOM_MARGIN,
                        right: RIGHT_MARGIN
                    }}
                    onClick={() => { setOpen(true); setMinimized(false); }}
                    aria-label="Open chat"
                >
                    Chat
                </button>
            )}

            {open && (
                <div
                    className={styles.chatWindow}
                    style={{
                        left: minimized ? 'auto' : position.x,
                        top: minimized ? 'auto' : position.y,
                        bottom: minimized ? DEFAULT_BOTTOM_MARGIN : 'auto',
                        right: minimized ? RIGHT_MARGIN : 'auto',
                        width: size.width,
                        height: size.height,
                        zIndex: baseZ + 10,
                        userSelect: dragging || resizing ? 'none' : 'auto',
                        position: 'fixed',
                    }}
                >
                    <div
                        className={styles.header}
                        style={{
                            borderBottom: minimized ? 'none' : undefined,
                            cursor: dragging ? 'grabbing' : undefined
                        }}
                        onMouseDown={startDrag}
                        tabIndex={-1}
                    >
                        <button className={styles.headerBtn} onClick={handleMinimize}>
                            {minimized ? <span>▢</span> : <span>—</span>}
                        </button>
                        <span className={styles.headerCenter}>Chat</span>
                        <button className={styles.headerBtn} onClick={() => { setOpen(false); setVisible(false); }}>×</button>
                    </div>

                    {!minimized && (
                        <>
                            {!CHAT_ENABLED && (
                                <div className={styles.disabledBanner}>
                                    This feature is currently disabled.
                                </div>
                            )}
                            <div
                                ref={chatRef}
                                className={styles.messages}
                                style={{ opacity: CHAT_ENABLED ? 1 : 0.7 }}
                            >
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.messageRow} ${msg.sender === 'bot' ? styles.messageBot : styles.messageUser}`}
                                    >
                                        <span>{msg.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.inputRow}>
                                <input
                                    className={styles.inputBox}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder={CHAT_ENABLED ? "Type your message…" : "Chat is disabled"}
                                    disabled={!CHAT_ENABLED}
                                />
                                <button
                                    className={styles.sendBtn}
                                    onClick={handleSend}
                                    disabled={!CHAT_ENABLED}
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    )}

                    {!minimized && (
                        <div
                            className={styles.resizeHandle}
                            onMouseDown={startResize}
                            tabIndex={-1}
                            aria-label="Resize chat window"
                        >
                            <svg width="18" height="18">
                                <polyline points="4,18 18,4" stroke="#ccc" strokeWidth="2" fill="none" />
                                <polyline points="10,18 18,10" stroke="#888" strokeWidth="1" fill="none" />
                            </svg>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
