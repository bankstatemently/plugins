export interface WalkTsFilesOptions {
    /** Skip `__tests__` directories entirely (never descend into them). */
    excludeTestsDir?: boolean;
}
export declare function walkTsFiles(dir: string, options?: WalkTsFilesOptions): string[];
