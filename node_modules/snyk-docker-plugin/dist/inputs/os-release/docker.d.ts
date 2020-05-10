import { Docker } from "../../docker";
import { OsReleaseFilePath } from "../../types";
export declare function getOsRelease(docker: Docker, releasePath: OsReleaseFilePath): Promise<string>;
