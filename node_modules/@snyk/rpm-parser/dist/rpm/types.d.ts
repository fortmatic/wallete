/// <reference types="node" />
/**
 * Size of an RPM metadata entry in bytes.
 */
export declare const ENTRY_INFO_SIZE = 16;
export interface EntryInfo {
    tag: number;
    type: number;
    offset: number;
    count: number;
}
export interface IndexEntry {
    info: EntryInfo;
    length: number;
    data: Buffer;
}
/**
 * All of the entries in an RPM package are optional.
 * When reading them we try to populate as much as we can.
 */
export interface PackageInfo {
    name: string;
    version: string;
    release: string;
    size: number;
    arch?: string;
    epoch?: number;
}
export declare enum RpmTag {
    NAME = 1000,
    VERSION = 1001,
    RELEASE = 1002,
    EPOCH = 1003,
    SIZE = 1009,
    ARCH = 1022
}
export declare enum RpmType {
    NULL = 0,
    CHAR = 1,
    INT8 = 2,
    INT16 = 3,
    INT32 = 4,
    INT64 = 5,
    STRING = 6,
    BIN = 7,
    STRING_ARRAY = 8,
    I18NSTRING = 9
}
