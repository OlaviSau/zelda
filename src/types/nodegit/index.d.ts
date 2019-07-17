declare module "nodegit" {
  declare interface CheckoutOptions {
    ancestorLabel?: string;
    baseline?: Tree;
    baselineIndex?: Index;
    checkoutStrategy?: number;
    dirMode?: number;
    disableFilters?: number;
    fileMode?: number;
    fileOpenFlags?: number;
    notifyCb?: () => void;
    notifyFlags?: number;
    notifyPayload?: Void;
    ourLabel?: string;
    paths?: string[];
    perfdataCb?: () => void;
    perfdataPayload?: Void;
    progressCb: () => void;
    progressPayload?: Void;
    targetDirectory?: string;
    theirLabel?: string;
    version?: number;
  }
  declare enum ReferenceType {
    INVALID,
    OID,
    SYMBOLIC,
    LISTALL
  }

  declare class Reference {
    static TYPE: ReferenceType;
    name(): string;
    shorthand(): string;
    isHead(): boolean;
    isRemote(): number;
    isBranch(): number;
  }

  declare class Tree {}

  declare class Index {}

  declare class Repository {

    static open(directory: string): Promise<Repository>;
    static openExt(directory: string, flags?: number, ceiling_dirs?: string): Promise<Repository>;
    head(): Reference;
    checkoutBranch(branch: string, options?: CheckoutOptions): Promise<number>;
    getCurrentBranch(): Promise<Reference>;
    getReferences(type: ReferenceType): Promise<Reference[]>;
  }
}
