import { config } from "@/chains/config";
import { WatchBlocksReturnType, watchBlocks } from "@wagmi/core";
import { useEffect, useState } from "react";

export const WAITING_BLOCK_COUNT = 3;

export interface BlockLatency {
  /**
   * If true, the watch block will start
   */
  enabled?: boolean;
  /**
   * the number of blocks to wait before setting the transaction as completed.
   * default is 3
   */
  blocksToWait?: number;
}

export default function useBlockLatency(props: BlockLatency) {
  const { enabled = false, blocksToWait = WAITING_BLOCK_COUNT } = props;

  const [startBlock, setStartBlock] = useState<BigInt>(BigInt(0));
  const [currentBlock, setCurrentBlock] = useState<BigInt>(BigInt(0));

  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [unwatchFn, setUnwatchFn] = useState<{ fn: WatchBlocksReturnType }>();

  //   0x8f8faa9ebb54deda91a62b4fc33550b19b9d33bf
  //   0xffffffff00000000000000000000000000038e08
  useEffect(() => {
    if (enabled) {
      setIsWaiting(true);
      setIsCompleted(false);

      const unwatch = watchBlocks(config, {
        onBlock(block) {
          console.log("watching block number::", block.number);
          setCurrentBlock(block.number);
        },
      });
      setUnwatchFn({ fn: unwatch as unknown as WatchBlocksReturnType });
    }
  }, [enabled]);

  useEffect(() => {
    if (startBlock === BigInt(0)) {
      setStartBlock(currentBlock);
    } else if (Number(startBlock) + blocksToWait <= Number(currentBlock)) {
      if (unwatchFn?.fn) {
        unwatchFn.fn();
      }
      setIsWaiting(false);
      setIsCompleted(true);
    }
  }, [currentBlock]);

  return { isWaiting, isCompleted };
}
