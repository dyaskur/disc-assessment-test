<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import type { IntroductoryText } from '$types/languages';
  import { wordGroupsStore } from '../../stores/wordSet';
  import { goto } from '$app/navigation';
  import { sessionManager } from '../../utils/sessionManager';

  const lang = $page.params.slug;

  async function fetchData(): Promise<IntroductoryText> {
    const response = await fetch(`${base}/languages/${lang}/intro.json`);
    return await response.json();
  }

  let hasProgress = true;
  onMount(async () => {
    const lastSession = sessionManager.loadSession();
    if (lastSession) {
      const wordGroups = JSON.parse(lastSession);
      wordGroupsStore.set(wordGroups.wordGroups);
      console.log(wordGroups, 'lastSession');
    } else {
      hasProgress = false;
      console.log('no lastSession');
    }
    const textDir = $page.params.slug === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('main')?.setAttribute('lang', lang);
    document.getElementById('main')?.setAttribute('dir', textDir);
    localStorage.setItem('visited_landing', 'true');
  });

  function removeSession(event: MouseEvent) {
    event.preventDefault(); // prevent normal <a> navigation
    try {
      sessionManager.clearSession();
      goto(`${base}/${lang}/test`);
    } catch (error) {
      console.error('Failed to restart session:', error);
    }
  }
</script>

{#await fetchData() then introData}
  <div class="flex-none flex justify-center mx-5">
    <h1 class="text-3xl md:text-4xl">{introData.heading}</h1>
  </div>

  <div class="flex-none sm:container sm:mx-auto mx-10">
    <p>
      {introData.introduction}
    </p>
  </div>

  <div class="flex-1 flex flex-col items-center mt-6 space-y-4">
    {#if hasProgress}
      <a href="{base}/{lang}/test" class="btn btn-wide btn-primary">
        <span>{introData.continueButton}</span>
      </a>
      <a href="{base}/{lang}/test" on:click={removeSession} class="btn btn-wide btn-secondary">
        <span>{introData.restartButton}</span>
      </a>
    {:else}
      <a href="{base}/{lang}/test" class="btn btn-wide btn-primary">
        <span>{introData.startButton}</span>
      </a>
    {/if}
  </div>
{/await}
