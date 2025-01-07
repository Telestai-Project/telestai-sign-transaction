const bitcoin = require("bitcoinjs-lib");
import { chains, toBitcoinJS } from "@hyperbitjs/chains";

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
  const networkMapper = {
    tls: chains.tls.main,
    "tls-test": chains.tls.test,
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
