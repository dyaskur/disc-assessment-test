/** @type {import('./$types').EntryGenerator} */
import langSets from '../../static/languages/list.json';

export const load = async ({ params }) => {
  return { languages: langSets };
};
export const prerender = true;
