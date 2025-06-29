/** @type {import('./$types').EntryGenerator} */
import langSets from '../../../static/languages/list.json';

export async function entries() {
  const langs = Object.keys(langSets);
  return langs.map((lang) => ({ slug: lang }));
}

export const load = async ({ params }) => {
  const lang = params.slug;
  const fallbackLang = 'en';
  const filesToLoad = ['intro.json', 'common.json'];

  // Glob all lang JSON files inside src/lib/data/languages
  const modules = import.meta.glob('/static/languages/*/*.json');

  const langFileMap: Record<string, Record<string, () => Promise<unknown>>> = {};

  // Build { [fileName]: { [lang]: resolver } }
  for (const [path, resolver] of Object.entries(modules)) {
    const [, , , selectedLang, fileName] = path.split('/');
    console.log(selectedLang, fileName, 'xxxx');
    if (!filesToLoad.includes(fileName)) continue;

    langFileMap[selectedLang] ||= {};
    langFileMap[selectedLang][fileName] = resolver;
  }

  const result: Record<string, any> = {};

  for (const fileName of filesToLoad) {
    const mainResolver = langFileMap[lang]?.[fileName];
    const fallbackResolver = langFileMap[fallbackLang]?.[fileName];

    let data = {};

    if (fallbackResolver) {
      data = (await fallbackResolver()) as Record<string, unknown>; // base fallback
    }

    if (mainResolver) {
      const override = (await mainResolver()) as Record<string, unknown>; // main lang values
      data = { ...data, ...override }; // ✅ merge: main overwrites fallback
    }

    const key = fileName.replace('.json', '');
    result[key] = data;
  }

  return result;
};

export const prerender = true;
export const trailingSlash = 'always';
