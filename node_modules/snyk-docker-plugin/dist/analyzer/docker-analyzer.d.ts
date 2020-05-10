import { DockerOptions } from "../docker";
import * as dockerFile from "../docker-file";
import { DynamicAnalysis } from "./types";
export declare function analyze(targetImage: string, dockerfileAnalysis?: dockerFile.DockerFileAnalysis, options?: DockerOptions): Promise<DynamicAnalysis>;
