import { ImageAnalysis } from "../../../analyzer/types";
import { DockerOptions } from "../../../docker";
export declare function analyze(targetImage: string, installedPackages: string[], pkgManager?: string, options?: DockerOptions): Promise<ImageAnalysis>;
