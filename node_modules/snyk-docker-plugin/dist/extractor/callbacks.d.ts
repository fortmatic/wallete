/// <reference types="node" />
import { Readable } from "stream";
import { ExtractAction, FileNameAndContent } from "./types";
export declare function applyCallbacks(matchedActions: ExtractAction[], fileContentStream: Readable): Promise<FileNameAndContent>;
