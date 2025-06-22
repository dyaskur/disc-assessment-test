<script lang="ts">
  import { onMount } from 'svelte/internal';
  import { base } from '$app/paths';
  import type { Language } from '$types/languages'; // fails here

  async function fetchData(): Promise<Record<string, Language>> {
    const response = await fetch(`${base}/languages/list.json`);
    // languages = await response.json();
    return await response.json();
  }

  onMount(async () => {
    await fetchData();
  });
</script>

{#await fetchData() then languages}
  <div class="flex flex-row flex-wrap justify-center">
    {#each Object.entries(languages) as [lang, values]}
      <a href="{base}/{lang}" class="btn md:btn-md lg:btn-lg text-white basis-1/4"
        ><span {lang}>{values.name}</span></a
      >
    {/each}
  </div>
{/await}

<style>
  .btn {
    background-color: #46709f;
    margin: 0.3rem;
  }
</style>
