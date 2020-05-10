import 'source-map-support/register';
export declare function parseMvnDependencyPluginCommandOutput(mvnCommandOutput: string): string[];
export declare function parseMvnExecCommandOutput(mvnCommandOutput: string): string[];
export declare function mergeMvnClassPaths(classPaths: string[]): string;
export declare function getClassPathFromMvn(targetPath: string): Promise<string>;
