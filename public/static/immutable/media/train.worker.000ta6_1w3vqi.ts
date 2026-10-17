/// <reference lib="webworker" />
import { trainSteps, type Params, type Point } from "./core";

declare const self: DedicatedWorkerGlobalScope;
export type TrainRequest = { id: number; params: Params; data: Point[]; steps: number; seed: number; from: number };
export type TrainReply = { id: number; params: Params; loss: number };

self.onmessage = (e: MessageEvent<TrainRequest>) => {
  const { id, params, data, steps, seed, from } = e.data;
  const r = trainSteps(params, data, steps, seed, from);
  const reply: TrainReply = { id, params: r.params, loss: r.loss };
  self.postMessage(reply);
};
