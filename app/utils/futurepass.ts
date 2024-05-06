import { ApiPromise } from "@polkadot/api";
import { AddressOrPair, SubmittableExtrinsic, SubmittableResultValue } from "@polkadot/api/submittable/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { createTypeUnsafe } from "@polkadot/types";
import { Extrinsic } from "@polkadot/types/interfaces/types";
import { AnyJson, ExtrinsicPayloadValue, ISubmittableResult } from "@polkadot/types/types";
import { objectSpread, u8aToHex, stringToU8a } from "@polkadot/util";
import { toHex } from "viem";

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

    console.log("extrinsic:: ", extrinsic)

    return new Promise((resolve, reject) => {
        let unsubscribe: () => void

        extrinsic.signAndSend(signer, (result) => {
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

    // console.log("api:: ", api)

    // console.log("extrinsic:: ", extrinsic)
    // console.log("signer:: ", extrinsic.signer.toHex())
    // console.log("method:: ", extrinsic.method)
    // console.log("api:: ", api.registry)

    // console.log("getHeader:: ", (await api.rpc.chain.getHeader()))

    const result: Record<string, AnyJson> = {};

    // TODO: Check this furter - Am I using the correct values here?
    const payload: ExtrinsicPayloadValue = {
        blockHash: hash.toHex(),
        era: era.toHex(),
        method: method.toHex(),
        nonce: nonce.toHex(),
        tip: tip.toHex(),
        assetId,
        genesisHash: api.genesisHash.toHex(),
        specVersion: api.runtimeVersion.specVersion.toHex(),
        transactionVersion: api.runtimeVersion.transactionVersion.toHex(),
    }

    const payloadObj = objectSpread(result, payload)

    // const extrinsicPayload = api.createType('ExtrinsicPayload', payloadObj).toU8a({ method: true })
    const extrinsicPayload = api.registry
        .createTypeUnsafe('ExtrinsicPayload', [payloadObj, { version }])
    const data = u8aToHex(extrinsicPayload.toU8a({ method: true }))

    console.log("extrinsicPayload:: ", extrinsicPayload)

    return {
        payload: data,
        message: toHex("Register a name: Trial and Error")
    }

}