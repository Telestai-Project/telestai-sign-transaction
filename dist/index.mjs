import {Buffer as $hCgyA$Buffer} from "buffer";
import {Transaction as $hCgyA$Transaction, TransactionBuilder as $hCgyA$TransactionBuilder, ECPair as $hCgyA$ECPair} from "bitcoinjs-lib";
import {toBitcoinJS as $hCgyA$toBitcoinJS} from "@hyperbitjs/chains";



var $c3f6c693698dc7cd$require$Buffer = $hCgyA$Buffer;

function $c3f6c693698dc7cd$export$c5552dfdbc7cec71(network, rawTransactionHex, UTXOs, privateKeys) {
    // Manually define the Telestai network parameters
    const telestaiMainNetwork = {
        name: 'Telestai',
        unit: 'TLS',
        decimalPlaces: 100000000,
        messagePrefix: '\x19Telestai Signed Message:\n',
        hashGenesisBlock: '0x00000056b9854abf830236d77443a8e3556f0244265e3eb12281a7bc43b7ff57',
        port: 8767,
        portRpc: 18766,
        protocol: {
            magic: 1414025797
        },
        seedsDns: [
            '45.79.159.32',
            'dnsseed.telestainodes.xyz',
            'telestai.seeds.multicoin.co'
        ],
        versions: {
            bip32: {
                private: 70615956,
                public: 70617039
            },
            bip44: 10117,
            private: 128,
            public: 66,
            scripthash: 127
        }
    };
    const networkMapper = {
        tls: telestaiMainNetwork
    };
    const coin = networkMapper[network];
    console.log("Coin:", coin);
    if (!coin) throw new Error("Validation error, first argument network must be tls, tls-test");
    //@ts-ignore
    const TELESTAI = (0, $hCgyA$toBitcoinJS)(coin);
    const tx = $hCgyA$Transaction.fromHex(rawTransactionHex);
    const txb = $hCgyA$TransactionBuilder.fromTransaction(tx, TELESTAI);
    function getKeyPairByAddress(address) {
        const wif = privateKeys[address];
        const keyPair = $hCgyA$ECPair.fromWIF(wif, TELESTAI);
        return keyPair;
    }
    function getUTXO(transactionId, index) {
        return UTXOs.find((utxo)=>{
            return utxo.txid === transactionId && utxo.outputIndex === index;
        });
    }
    for(let i = 0; i < tx.ins.length; i++){
        const input = tx.ins[i];
        const txId = $c3f6c693698dc7cd$require$Buffer.from(input.hash, "hex").reverse().toString("hex");
        const utxo = getUTXO(txId, input.index);
        if (!utxo) throw Error("Could not find UTXO for input " + input);
        const address = utxo.address;
        const keyPair = getKeyPairByAddress(address);
        const signParams = {
            prevOutScriptType: "p2pkh",
            vin: i,
            keyPair: keyPair,
            UTXO: utxo
        };
        txb.sign(signParams);
    }
    const signedTxHex = txb.build().toHex();
    return signedTxHex;
}
var $c3f6c693698dc7cd$export$2e2bcd8739ae039 = {
    sign: $c3f6c693698dc7cd$export$c5552dfdbc7cec71
};


export {$c3f6c693698dc7cd$export$c5552dfdbc7cec71 as sign, $c3f6c693698dc7cd$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=index.mjs.map
