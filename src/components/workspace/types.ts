export interface WorkspaceDocument {
  id: string;
  title: string;
  pages: number;
  fileUrl: string;
}

export interface Workspace {
  id: string;
  title: string;
  selected: boolean;
  documents: WorkspaceDocument[];
}
