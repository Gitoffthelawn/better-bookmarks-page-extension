import React from 'react';
import {
  BookmarkFolderRoot,
  IBookmarkItem
} from '../Components/Bookmark/BookmarkFolderRoot';
import { useBookmarks } from '../Hooks/useBookmarks';

export const Content = () => {
  const { data, loading } = useBookmarks();

  if (loading) {
    return <p>Loading</p>;
  }

  let bookmarkFolders: IBookmarkItem[] = [];

  if (data) {
    // Find all level-1 folders
    const level1Folders: IBookmarkItem[] = data.flatMap((folder) => {
      if (folder.children) {
        return folder.children.filter((child: IBookmarkItem) => child.children);
      } else {
        return [];
      }
    });

    const idsToRemove = level1Folders.map((l1) => l1.id);
    const bookmarksWithoutLevel1s = data.map((child) => {
      if (child.children) {
        child.children = child.children.filter(
          (c) => !idsToRemove.includes(c.id)
        );
      }
      return child;
    });

    // Add level-1 folders to the bookmark folders array
    bookmarkFolders.push(...bookmarksWithoutLevel1s, ...level1Folders);
  }

  return (
    <div className="mx-auto flex flex-col justify-center p-2 align-middle">
      {bookmarkFolders.length ? (
        <div className="w-full gap-12 sm:columns-1 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-4">
          {bookmarkFolders
            .filter((folder) => folder.children?.length)
            .map((folder) => {
              //Safe-guard
              const children = folder.children ?? [];
              return (
                <BookmarkFolderRoot
                  name={folder.title}
                  folderContents={children}
                  key={`bookmark_root_folder_${folder.id}`}
                />
              );
            })}
        </div>
      ) : (
        <p className="text-sm italic text-text-primary">
          Looks like you don't have any Bookmarks, add some to see the magic!
          🪄✨
        </p>
      )}
    </div>
  );
};
