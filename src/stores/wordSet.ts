import { writable, type Writable } from 'svelte/store';
import type { WordGroup } from '$types/languages';

// create the writable store and set the initial value to the empty data
export const wordGroupsStore: Writable<WordGroup[]> = writable();

// load the word sets from a JSON file and set the value of the wordSetGroups
