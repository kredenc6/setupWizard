///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// FOR STATUS RESULT ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
    
    interface StatusResultRenamed {
      from: string;
      to: string;
    }

    interface FileStatusResult {

      /** Original location of the file, when the file has been moved */
      from?: string

      /** Path of the file */
      path: string;

      /** First digit of the status code of the file, e.g. 'M' = modified.
       Represents the status of the index if no merge conflicts, otherwise represents
      status of one side of the merge. */
      index: string;

      /** Second digit of the status code of the file. Represents status of the working directory
       if no merge conflicts, otherwise represents status of other side of a merge. */
      working_dir: string;
    }

export interface StatusResult {
  not_added: string[];
  conflicted: string[];
  created: string[];
  deleted: string[];
  modified: string[];
  renamed: StatusResultRenamed[];
  staged: string[];
  files: FileStatusResult[];
  ahead: number;
  behind: number;
  current: string | null;
  tracking: string | null;

  /**
   * Gets whether this represents a clean working branch.
   */
  isClean(): boolean;
};
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

    
export interface CommitSummary {
  author: null | {
    email: string;
    name: string;
  };
  branch: string;
  commit: string;
  summary: {
    changes: number;
    insertions: number;
    deletions: number;
  };
};


///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// FOR MERGE SUMMARY /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
    interface PullResult {
      /** Array of all files that are referenced in the pull */
      files: string[];

      /** Map of file names to the number of insertions in that file */
      insertions: { [key: string]: number };

      /** Map of file names to the number of deletions in that file */
      deletions: any;

      summary: {
        changes: number;
        insertions: number;
        deletions: number;
      };

      /** Array of file names that have been created */
      created: string[];

      /** Array of file names that have been deleted */
      deleted: string[];
    }

    /**
     * Where the file was deleted, if there is a modify/delete conflict
     */
    interface MergeConflictDeletion {
      deleteRef: string;
    }

    interface MergeConflict {

      /**
       * Type of conflict
       */
      reason: string;

      /**
       * Path to file
       */
      file: string;

      /**
       * Additional detail for the specific type of conflict
       */
      meta?: MergeConflictDeletion;
    }

export interface MergeSummary extends PullResult {
  conflicts: MergeConflict[];
  merges: string[];
  result: 'success' | string;
  failed: boolean;
};

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////