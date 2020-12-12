import { getCategories } from './categories';
import { getAuthors } from './authors';
import { Author, ProcessedVideo, Video } from '../common/interfaces';

export const getVideos = (): Promise<ProcessedVideo[]> => {
  return Promise.all([getCategories(), getAuthors()]).then(([categories, authors]) => {
    let videos: ProcessedVideo[] = [];

    authors.map((author) =>
      author.videos.map(({ id, catIds, name }, j) => {
        let single: ProcessedVideo = {
          id,
          name,
          author: author.name,
          categories: catIds.map((catId) => categories[categories.findIndex((v) => v.id === catId)].name),
        };

        videos.push(single);
      })
    );
    return videos;
  });
};

export const addVideo = async (author: Author): Promise<Author[]> => {
  return await fetch(`${process.env.REACT_APP_API}/authors/${author.id}`, {
    method: 'PUT',
    body: JSON.stringify(author),
  }).then((response) => (response.json() as unknown) as Author[]);
};
