export const SOCKS5_GROUP = '🧦 SOCKS5';

export const PROTOCOL_GROUP_PATTERNS = [
    { name: 'VLESS 节点', pattern: /\bvless\b/i },
    { name: 'Trojan 节点', pattern: /\btrojan\b/i },
    { name: 'VMess 节点', pattern: /\bvmess\b/i },
    { name: 'Hysteria2 节点', pattern: /\b(?:hysteria2|hy2)\b/i },
    { name: 'Shadowsocks 节点', pattern: /\b(?:ss|shadowsocks)\b/i },
    { name: 'TUIC 节点', pattern: /\btuic\b/i },
    { name: 'AnyTLS 节点', pattern: /\banytls\b/i },
    { name: 'WireGuard 节点', pattern: /\bwireguard\b/i },
    { name: 'SOCKS5 节点', pattern: /\bsocks5?\b/i }
];

export function isSocks5Type(type) {
    const value = String(type || '').toLowerCase();
    return value === 'socks5' || value === 'socks5-tls' || value === 'socks';
}

export function isSocks5Proxy(proxy) {
    return Boolean(proxy) && typeof proxy === 'object' && isSocks5Type(proxy.type);
}

export function isSocks5GroupName(name = '') {
    const normalized = String(name || '')
        .replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+/, '')
        .replace(/[\s_-]+/g, '')
        .replace(/节点/g, '')
        .toLowerCase();
    return /socks5?/.test(normalized);
}

export function insertGroupBeforeDirect(members = [], groupName) {
    const next = Array.from(new Set((Array.isArray(members) ? members : []).filter(Boolean)));
    if (!groupName || next.includes(groupName)) return next;
    const idx = next.findIndex(item => String(item).toUpperCase() === 'DIRECT');
    if (idx >= 0) {
        next.splice(idx, 0, groupName);
        return next;
    }
    next.push(groupName);
    return next;
}

export function groupNodeLinesByProtocol(nodeLines = []) {
    const grouped = [];
    for (const { name, pattern } of PROTOCOL_GROUP_PATTERNS) {
        const matched = nodeLines.filter(({ line }) => pattern.test(line));
        if (matched.length > 0) {
            grouped.push({
                name,
                lines: matched.map(item => item.line),
                count: matched.length
            });
        }
    }
    return grouped;
}
