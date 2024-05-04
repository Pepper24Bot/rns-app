import { ApiPromise, Keyring } from "@polkadot/api";
import { AddressOrPair, SubmittableExtrinsic, SubmittableResultValue } from "@polkadot/api/submittable/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { Address, Extrinsic, FunctionMetadataLatest } from "@polkadot/types/interfaces/types";
import { AnyTuple, CallBase, ExtrinsicPayloadValue, ISubmittableResult } from "@polkadot/types/types";
import { Hex, fromBytes, fromHex, toHex } from "viem";


export interface SubmittableResponse {
    blockHash: string;
    extrinsicHash: string;
    extrinsicIndex: number;
    extrinsicId: string;
    result: SubmittableResultValue;
}

export interface SubmittableRequest {
    extrinsic: SubmittableExtrinsic<"promise", ISubmittableResult>,
    signer: AddressOrPair,
    // signature: string,
    // payload: ExtrinsicPayloadValue | Uint8Array | Hex,
    // walletAddress: string,
}

export interface ExtrinsicPayload {
    api: ApiPromise,
    signer: string | KeyringPair,
    extrinsic: Extrinsic
}

/**
 * See example: https://github.com/futureversecom/trn-examples/blob/main/packages/utils/src/sendExtrinsic.ts
 * @param props 
 * @returns 
 */
export const sendExtrinsic = async (props: SubmittableRequest) => {
    const { extrinsic, signer } = props

    console.log("extrinsic:: ", extrinsic);
    console.log("signer:: ", signer);

    const keyring = new Keyring({ type: 'ethereum' })
    const accountKeyring = keyring.addFromAddress("0x8F8faa9eBB54DEda91a62B4FC33550B19B9d33bf")
    // console.log("accountKeyring:: ", accountKeyring)

    return new Promise((resolve, reject) => {
        let unsubscribe: () => void

        extrinsic.signAndSend(accountKeyring, (result) => {
            console.log("result:: ", result)
            const { status, dispatchError, txHash, txIndex, blockNumber } = result as SubmittableResultValue
            if (!status.isFinalized) return;
            if (!txIndex || !blockNumber) return;

            if (!dispatchError) {
                unsubscribe?.();
                const blockHash = status.asFinalized.toString();
                const height = blockNumber.toString().padStart(10, "0");
                const index = txIndex.toString().padStart(6, "0");
                const hash = blockHash.slice(2, 7);
                const extrinsicId = `${height}-${index}-${hash}`;

                return resolve({
                    blockHash,
                    extrinsicHash: txHash.toString(),
                    extrinsicIndex: txIndex,
                    extrinsicId,
                    result,
                });
            }

            if (!dispatchError.isModule) {
                unsubscribe?.();
                return reject(new Error(`Extrinsic failed ${JSON.stringify(dispatchError.toJSON())}`));
            }

            const { section, name, docs } = dispatchError.registry.findMetaError(
                dispatchError.asModule
            );
            unsubscribe?.();
            reject(new Error(`Extrinsic sending failed, [${section}.${name}] ${docs}`));
        })
            .then((unsub) => (unsubscribe = unsub))
            .catch((error) => reject(error));
    })
}

/**
 * 
 * @param props 
 * @returns 
 */
export const createExtrinsicPayload = async (props: ExtrinsicPayload) => {
    const { api, signer, extrinsic } = props
    const { method, era, version, nonce, tip, assetId, hash } = extrinsic

    const payload: ExtrinsicPayloadValue = {
        blockHash: hash,
        era,
        genesisHash: api.genesisHash,
        method,
        nonce: nonce.toBigInt(),
        tip: tip.toBigInt(),
        assetId,
        specVersion: api.runtimeVersion.specVersion,
        transactionVersion: api.runtimeVersion.transactionVersion,
    }

    const txPayload = api.createType("ExtrinsicPayload", payload, { version })
    const txU8a = txPayload.toU8a();

    console.log("txPayload:: ", txPayload)
    console.log("payload:: ", payload)
    // console.log("txU8a:: ", txU8a)

    const message = toHex("Trial and Error");

    return { payload, message, txU8a }

}