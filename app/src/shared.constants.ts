import LightningFS from "@isomorphic-git/lightning-fs";
import { FS } from "./shared.types";

export const fs: FS = new LightningFS("fs");

export const dir = "/repo";
