<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import List from '../../../components/list.svelte';
  import Results from '../../../components/results.svelte';
  import { wordGroupsStore } from '../../../stores/wordSet';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import type { Word, AssessmentResultText, AssessmentInstructions } from '$types/languages';
  import { goto } from '$app/navigation';

  const lang = $page.params.slug;
  let modalCheckbox: HTMLInputElement;
  let testLanguage: AssessmentInstructions | null = null;
  let resultsLanguage: AssessmentResultText | null = null;
  let showResults = false;

  let pageNumber = 0;
  let maxPageNumber = 0;

  let options: {
    first: Word | null;
    second: Word | null;
    third: Word | null;
    fourth: Word | null;
  } = { first: null, second: null, third: null, fourth: null };
  let items1: Word[] = [],
    items2: Word[] = [],
    items3: Word[] = [],
    items4: Word[] = [];

  let ready = false;
  let progress = 0;
  $: {
    const wordGroups = get(wordGroupsStore);
    if (wordGroups && wordGroups.length > 0) {
      updatePageData();
    }
  }

  onMount(async () => {
    const visited = localStorage.getItem('visited_landing');
    if (!visited) {
      return goto(`/${lang}`);
    }
    const lastSession = localStorage.getItem('lastSession');
    if (lastSession) {
      const wordGroups = JSON.parse(lastSession);
      pageNumber = wordGroups.pageNumber;
      wordGroupsStore.set(wordGroups.wordGroups);
      console.log(wordGroups, 'lastSession');
      openModal();
    } else {
      console.log('no lastSession');
    }
    await fetchData();
    resultsLanguage = await fetchResultsLanguage();
    localStorage.removeItem('visited_landing');
  });

  async function fetchResultsLanguage() {
    const res = await fetch(`${base}/languages/${lang}/results.json`);
    return await res.json();
  }

  async function fetchData() {
    const [testRes, wordsRes] = await Promise.all([
      fetch(`${base}/languages/${lang}/test.json`),
      fetch(`${base}/languages/${lang}/wordGroups.json`)
    ]);

    testLanguage = await testRes.json();
    const wordGroupData = await wordsRes.json();

    wordGroupsStore.set(wordGroupData.wordGroups);

    wordGroupsStore.subscribe(() => {
      progress = (pageNumber / maxPageNumber) * 100;
      const wordGroups = get(wordGroupsStore);
      const group = wordGroups[pageNumber];
      ready = !group.words.some((word) => word.rank === null);
    });
    updatePageData(); // Make sure it's called after store is updated
  }

  function updatePageData() {
    const wordGroups = get(wordGroupsStore);

    if (!wordGroups || wordGroups.length === 0) return;

    const group = wordGroups[pageNumber];
    const unrankedWords = group.words.filter((word) => word.rank === null);
    maxPageNumber = wordGroups.length;

    options = {
      first: unrankedWords[0] || null,
      second: unrankedWords[1] || null,
      third: unrankedWords[2] || null,
      fourth: unrankedWords[3] || null
    };

    ready = !group.words.some((word) => word.rank === null);
    progress = (pageNumber / maxPageNumber) * 100;
    console.log(ready, progress, options, 'updatePageData');
  }

  function saveProgress() {
    const wordGroups = get(wordGroupsStore);
    if (wordGroups && wordGroups.length > 0) {
      const key = `lastSession`;
      const lastSession = {
        lang,
        pageNumber: pageNumber,
        wordGroups
      };
      localStorage.setItem(key, JSON.stringify(lastSession));
    }
  }

  function handleNext() {
    const wordGroups = get(wordGroupsStore);

    if (wordGroups && pageNumber >= wordGroups.length - 1) {
      showResults = true;
      return;
    }

    pageNumber++;
    resetItems();
    updatePageData();
    saveProgress();
  }

  function handleReset() {
    wordGroupsStore.update((groups) => {
      const updated = [...groups];
      updated[pageNumber] = {
        ...updated[pageNumber],
        words: updated[pageNumber].words.map((word) => ({ ...word, rank: null }))
      };
      return updated;
    });

    resetItems();
    updatePageData();
  }

  function resetItems() {
    items1 = [];
    items2 = [];
    items3 = [];
    items4 = [];
  }

  function openModal() {
    modalCheckbox.checked = true;
  }

  function restartProgress() {
    pageNumber = 0;
    modalCheckbox.checked = false;
    updatePageData();
  }
</script>

{#if testLanguage}
  {#if !showResults}
    <div class="flex-none sm:container sm:mx-auto mx-10 text-center">
      <p>{testLanguage.instructionsText}</p>
    </div>

    <div class="available flex w-full h-50 pb-3">
      <div class="flex flex-col w-full options">
        {#if options.first}
          <List items={[options.first]} bind:pageNumber />
        {/if}
        {#if options.second}
          <List items={[options.second]} bind:pageNumber />
        {/if}
        {#if options.third}
          <List items={[options.third]} bind:pageNumber />
        {/if}
        {#if options.fourth}
          <List items={[options.fourth]} bind:pageNumber />
        {/if}
      </div>

      <div class="divider divider-horizontal" />

      <div class="flex flex-col w-full answers">
        <List items={items1} testValue={3} bind:pageNumber placeholder={testLanguage.scale[0]} />
        <List items={items2} testValue={2} bind:pageNumber placeholder={testLanguage.scale[1]} />
        <List items={items3} testValue={1} bind:pageNumber placeholder={testLanguage.scale[2]} />
        <List items={items4} testValue={0} bind:pageNumber placeholder={testLanguage.scale[3]} />
      </div>
    </div>

    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div class="bg-yellow-500 h-2.5 rounded-full" style="width: {progress}%" />
    </div>

    <div class="flex justify-evenly space-x-2 mt-1">
      <button on:click={handleReset} class="btn md:btn-wide btn-secondary">
        {testLanguage.resetButton}
      </button>
      <button on:click={handleNext} class="btn md:btn-wide btn-primary" disabled={!ready}>
        {testLanguage.nextButton}
      </button>
    </div>
  {:else if resultsLanguage}
    <Results {resultsLanguage} />
  {/if}
{/if}

<!-- Checkbox-driven modal -->
<input
  type="checkbox"
  id="continue_progress_modal"
  class="modal-toggle"
  bind:this={modalCheckbox}
/>

<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Would you like to continue last progress?</h3>
    <p class="py-4">You previously did this test but you did not complete it.</p>
    <div class="modal-action">
      <label on:click={restartProgress} class="btn btn-secondary">Restart</label>
      <label for="continue_progress_modal" class="btn btn-primary">Continue</label>
    </div>
  </div>
</div>
