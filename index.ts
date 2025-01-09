const bitcoin = require("bitcoinjs-lib");
import { toBitcoinJS } from "@hyperbitjs/chains";

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

export function sign(
  network: "tls" | "tls-test",
  rawTransactionHex: string,
  UTXOs: Array<IUTXO>,
  privateKeys: any
): string {
  // Manually define the Telestai network parameters
  const telestaiMainNetwork = {
    name: 'Telestai',
    unit: 'TLS',
    decimalPlaces: 100000000,
    messagePrefix: '\x19Telestai Signed Message:\n',
    hashGenesisBlock: '0x00000056b9854abf830236d77443a8e3556f0244265e3eb12281a7bc43b7ff57',
    port: 8767,
    portRpc: 18766,
    protocol: { magic: 1414025797 },
    seedsDns: [
      '45.79.159.32',
      'dnsseed.telestainodes.xyz',
      'telestai.seeds.multicoin.co'
    ],
    versions: {
      bip32: { private: 70615956, public: 70617039 },
      bip44: 10117,
      private: 128,
      public: 66,
      scripthash: 127
    }
  };

  const networkMapper = {
    tls: telestaiMainNetwork,
    // "tls-test": telestaiTestNetwork, // Define this if needed
  };

  const coin = networkMapper[network];

  if (!coin) {
    throw new Error(
      "Validation error, first argument network must be tls, tls-test"
    );
  }

  //@ts-ignore
  const TELESTAI = toBitcoinJS(coin);

  const tx = bitcoin.Transaction.fromHex(rawTransactionHex);
  const txb = bitcoin.TransactionBuilder.fromTransaction(tx, TELESTAI);

  function getKeyPairByAddress(address) {
    const wif = privateKeys[address];
    const keyPair = bitcoin.ECPair.fromWIF(wif, TELESTAI);
    return keyPair;
  }

  function getUTXO(transactionId, index) {
    return UTXOs.find((utxo) => {
      return utxo.txid === transactionId && utxo.outputIndex === index;
    });
  }

  for (let i = 0; i < tx.ins.length; i++) {
    const input = tx.ins[i];

    const txId = Buffer.from(input.hash, "hex").reverse().toString("hex");
    const utxo = getUTXO(txId, input.index);
    if (!utxo) {
      throw Error("Could not find UTXO for input " + input);
    }
    const address = utxo.address;
    const keyPair = getKeyPairByAddress(address);

    const signParams = {
      prevOutScriptType: "p2pkh",
      vin: i,
      keyPair,
      UTXO: utxo,
    };
    txb.sign(signParams);
  }
  const signedTxHex = txb.build().toHex();
  return signedTxHex;
}
export default {
  sign,
};
