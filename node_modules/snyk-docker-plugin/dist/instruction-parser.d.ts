import { Dockerfile } from "dockerfile-ast";
export { getDockerfileBaseImageName, getDockerfileLayers, getPackagesFromRunInstructions, DockerFilePackages, DockerFileLayers, instructionDigest, };
interface DockerFilePackages {
    [packageName: string]: {
        instruction: string;
    };
}
interface DockerFileLayers {
    [id: string]: {
        instruction: string;
    };
}
declare function getPackagesFromRunInstructions(dockerfile: Dockerfile): DockerFilePackages;
/**
 * Return the image name of the last from stage, after resolving all aliases
 * @param dockerfile Dockerfile to use for retrieving the last stage image name
 */
declare function getDockerfileBaseImageName(dockerfile: Dockerfile): string | undefined;
declare function instructionDigest(instruction: any): string;
declare function getDockerfileLayers(dockerfilePkgs: DockerFilePackages): DockerFileLayers;
