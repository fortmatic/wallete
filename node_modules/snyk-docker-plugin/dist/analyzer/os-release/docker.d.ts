import { DockerOptions } from "../../docker";
import { DockerFileAnalysis } from "../../docker-file";
import { OSRelease } from "../types";
export declare function detect(targetImage: string, dockerfileAnalysis?: DockerFileAnalysis, options?: DockerOptions): Promise<OSRelease>;
