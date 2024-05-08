import { ApiPromise } from "@polkadot/api";
import { SignerOptions, SubmittableExtrinsic, SubmittableResultValue } from "@polkadot/api/submittable/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { GenericSignerPayload } from "@polkadot/types";
import { Address } from "viem";
import { blake2AsHex } from '@polkadot/util-crypto';

export interface SubmittableResponse {
    blockHash: string;
    extrinsicHash: string;
    extrinsicIndex: number;
    extrinsicId: string;
    result: SubmittableResultValue;
}

export interface SubmittableRequest {
    extrinsic: SubmittableExtrinsic<"promise", ISubmittableResult>,
}

export interface ExtrinsicPayload {
    api: ApiPromise,
    address: string | Address,
    extrinsic: SubmittableExtrinsic<'promise'>,
    options?: Partial<SignerOptions>
}

/**
 * See example: https://github.com/futureversecom/trn-examples/blob/main/packages/utils/src/sendExtrinsic.ts
 * @param props 
 * @returns 
 */
export const sendExtrinsic = async (props: SubmittableRequest) => {
    const { extrinsic } = props

    return new Promise((resolve, reject) => {
        let unsubscribe: () => void

        extrinsic.send((result) => {
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
export const signExtrinsicPayload = async (props: ExtrinsicPayload) => {
    const { api, address, extrinsic, options } = props

    const { method, tip, assetId } = extrinsic
    const { genesisHash, runtimeVersion, extrinsicVersion, registry } = api

    const { header, mortalLength, nonce } = await api.derive.tx.signingInfo(address);

    const era = api.registry.createTypeUnsafe('ExtrinsicEra', [{
        current: header?.number,
        period: mortalLength
    }])

    const payloadOptions = {
        address,
        blockHash: header?.hash,
        blockNumber: header?.number,
        era,
        method: method,
        nonce,
        assetId,
        tip,
        genesisHash,
        runtimeVersion,
        specVersion: runtimeVersion.specVersion,
        transactionVersion: runtimeVersion.transactionVersion,
        version: extrinsicVersion,
        signedExtensions: registry.signedExtensions,
        ...options
    }

    const payload = api.registry.createTypeUnsafe('SignerPayload', [payloadOptions]) as unknown as GenericSignerPayload;

    // The hex-encoded data for this request
    const { data } = payload.toRaw();

    const hashed = data.length > (256 + 1) * 2 ? blake2AsHex(data) : data;
    const ethPayload = blake2AsHex(hashed);

    console.log("raw-data:: ", data)
    console.log("payload:: ", payload)
    console.log("payload.toPayload:: ", payload.toPayload())
    console.log("ethPayload:: ", ethPayload)

    // Get the user to sign the message
    const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [ethPayload, address],
    });
    console.log(`signature:: ${signature}`)

    // Add the signature to the extrinsic
    const signedExtrinsic = extrinsic.addSignature(
        address ?? "",
        signature as `0x${string}`,
        payload.toPayload()
    );

    return signedExtrinsic
}