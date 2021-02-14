import { BuildOptions, Lambda, shouldServe } from '@vercel/build-utils';
declare const version = 3;
declare function build({ files, entrypoint, workPath, config, meta, }: BuildOptions): Promise<{
    output: Lambda;
}>;
export { version, build, shouldServe };
