import { DockerOptions } from "../../docker";
export declare function getAptDbFileContent(targetImage: string, options?: DockerOptions): Promise<{
    dpkgFile: string;
    extFile: string;
}>;
