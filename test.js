const Signer = require("./dist/index.cjs");

/*
export function sign(network: "tls" | "tls-test" | "evr" | "evr-test",
rawTransactionHex: string,
 UTXOs: Array<IUTXO>, 
 privateKeys: any): string;
*/
test("Verify sign TLS transaction", () => {
  const testData = require("./mock/test_tls_transaction.json");
  const network = "tls-test";
  const UTXOs = testData.debug.tlsUTXOs;
  const privateKeys = testData.debug.privateKeys;
  const rawUnsignedTransaction = testData.debug.rawUnsignedTransaction;

  const expectedResult = testData.debug.signedTransaction;
  const asdf = Signer.sign(network, rawUnsignedTransaction, UTXOs, privateKeys);

  expect(asdf).toBe(expectedResult);
});
test("Verify sign ASSET transaction", () => {
  const testData = require("./mock/test_asset_transaction.json");
  const network = "tls-test";
  const UTXOs = testData.debug.tlsUTXOs.concat(testData.debug.assetUTXOs);

  const privateKeys = testData.debug.privateKeys;
  const rawUnsignedTransaction = testData.debug.rawUnsignedTransaction;

  const expectedResult = testData.debug.signedTransaction;
  const asdf = Signer.sign(network, rawUnsignedTransaction, UTXOs, privateKeys);

  expect(asdf).toBe(expectedResult);
});
