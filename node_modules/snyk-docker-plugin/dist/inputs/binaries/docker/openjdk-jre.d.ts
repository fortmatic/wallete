import { Binary } from "../../../analyzer/types";
import { DockerOptions } from "../../../docker";
export { extract, installedByPackageManager };
declare function extract(targetImage: string, options?: DockerOptions): Promise<Binary | null>;
declare function installedByPackageManager(installedPackages: string[], pkgManager?: string): boolean;
