interface IUTXO {
    address: string;
    assetName: string;
    txid: string;
    outputIndex: number;
    script: string;
    satoshis: number;
    height?: number;
    value: number;
}
export function sign(network: "tls" | "tls-test", rawTransactionHex: string, UTXOs: Array<IUTXO>, privateKeys: any): string;
declare const _default: {
    sign: typeof sign;
};
export default _default;

//# sourceMappingURL=types.d.ts.map
