<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import { wordGroupsStore } from '../stores/wordSet';
  import type { Word } from '$types/languages.js';

  const flipDurationMs = 100;

  export let items: Word[] = [];
  export let placeholder = '';
  export let testValue: number | null = null;
  export let pageNumber = 0;

  const MAX_ALLOWED = 1;
  $: dropFromOthersDisabled = items.length === MAX_ALLOWED || !placeholder;
  $: dragDisabled = !!placeholder && items.length === 0;

  const updateWordRank = (pageNumber: number, wordId: number, newRank: number | null) => {
    if (newRank !== null) {
      wordGroupsStore.update((sets) => {
        const wordIndex = sets[pageNumber].words.findIndex((word) => word.id === wordId);
        if (wordIndex > -1) {
          sets[pageNumber].words[wordIndex].rank = Number(newRank);
        }
        return sets; // return the updated store
      });
    }
  };

  function handleConsider(e) {
    items = e.detail.items;
  }

  function handleFinalize(e) {
    items = e.detail.items;
    if (e.detail.items.length === 0) {
      return;
    }
    updateWordRank(pageNumber, e.detail.items[0].id, testValue);
  }
</script>

<div
  class="flex flex-col justify-evenly w-full place-items-center answer"
  use:dndzone={{ items, flipDurationMs, dropFromOthersDisabled, dragDisabled }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}
>
  {#if placeholder && !items.length}
    <span style="color: grey">{placeholder}</span>
  {/if}
  {#each items as item (item.id)}
    <div class="rounded-box" animate:flip={{ duration: flipDurationMs }}>
      {item.word}
    </div>
  {/each}
</div>

<style>
  .answer.answer .rounded-box {
    margin: 0;
  }

  .rounded-box {
    margin: 0.2em;
    padding: 0.3em;
    background-color: #3e5387;
    color: white;
  }

  .answer {
    text-align: center;
    border: 1px solid black;
    margin: 0.2em;
    padding: 0.3em;
    min-height: 3rem;
  }
</style>
