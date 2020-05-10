export { DiscoveredDirectory, DiscoveredFile, parseLsOutput, iterateFiles };
interface DiscoveredDirectory {
    name: string;
    subDirs: DiscoveredDirectory[];
    files: DiscoveredFile[];
}
interface DiscoveredFile {
    name: string;
    path: string;
}
/**
 * Iterate over all files of a given DiscoveredDirectory structure.
 */
declare function iterateFiles(root: DiscoveredDirectory, iterator: (f: DiscoveredFile) => void): Promise<void>;
/**
 * Parse the output of a ls command and return a DiscoveredDirectory
 * structure. Can handle plain and recursive output. Root path will
 * always be normalized to '/'. State scope is a directory i.e. the
 * parser can handle missing parent directories or an out-of-order
 * directory sequence.
 */
declare function parseLsOutput(output: string): DiscoveredDirectory;
