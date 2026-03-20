import * as vscode from 'vscode';

export function getProjectName(): string | null {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return null;
  // Use the first workspace folder's name
  return folders[0].name;
}
