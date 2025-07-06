/** @type {import('./$types').EntryGenerator} */
import langSets from '../../../static/languages/list.json';
import { loadLanguage } from '../../utils/internationalization';

export async function entries() {
  const langs = Object.keys(langSets);
  return langs.map((lang) => ({ slug: lang }));
}

export const load = async ({ params }) => {
  const lang = params.slug;
  const filesToLoad = ['intro.json', 'common.json'];

  return loadLanguage(lang, filesToLoad);
};

export const prerender = true;
export const trailingSlash = 'always';
