import { describe, expect, it } from 'vitest';
import {
    SOCKS5_GROUP,
    groupNodeLinesByProtocol,
    insertGroupBeforeDirect,
    isSocks5GroupName,
    isSocks5Proxy
} from '../../functions/modules/subscription/protocol-groups.js';

describe('protocol groups', () => {
    it('groups SOCKS5 URLs without treating Shadowsocks as SOCKS', () => {
        const groups = groupNodeLinesByProtocol([
            { line: 'socks5://user:pass@5.6.7.8:1080#Local-SOCKS' },
            { line: 'ss://YWVzLTEyOC1nY206cGFzcw==@1.2.3.4:8388#SS-01' }
        ]);
        const socks = groups.find(group => group.name === 'SOCKS5 节点');
        const shadowsocks = groups.find(group => group.name === 'Shadowsocks 节点');

        expect(socks?.count).toBe(1);
        expect(socks?.lines[0]).toContain('socks5://');
        expect(shadowsocks?.count).toBe(1);
    });

    it('identifies Clash and sing-box SOCKS outbound types', () => {
        expect(isSocks5Proxy({ type: 'socks5', name: 'A' })).toBe(true);
        expect(isSocks5Proxy({ type: 'socks5-tls', name: 'B' })).toBe(true);
        expect(isSocks5Proxy({ type: 'socks', tag: 'C' })).toBe(true);
        expect(isSocks5Proxy({ type: 'trojan', name: 'D' })).toBe(false);
        expect(isSocks5GroupName(SOCKS5_GROUP)).toBe(true);
        expect(isSocks5GroupName('SOCKS5 节点')).toBe(true);
        expect(isSocks5GroupName('👋 手动切换')).toBe(false);
    });

    it('inserts the SOCKS5 group before DIRECT', () => {
        expect(insertGroupBeforeDirect(['HK-01', 'DIRECT'], SOCKS5_GROUP)).toEqual(['HK-01', SOCKS5_GROUP, 'DIRECT']);
        expect(insertGroupBeforeDirect(['HK-01', SOCKS5_GROUP, 'DIRECT'], SOCKS5_GROUP)).toEqual(['HK-01', SOCKS5_GROUP, 'DIRECT']);
    });
});
