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
  let modalCheckbox: HTMLInputElement;
  onMount(async () => {
    const lastSession = sessionManager.loadSession();
    if (lastSession) {
      const wordGroups = lastSession;
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

  function openModal(e: MouseEvent) {
    e.preventDefault();
    modalCheckbox.checked = true;
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
      <a href="#" on:click={openModal} class="btn btn-wide btn-secondary">
        <span>{introData.restartButton}</span>
      </a>
    {:else}
      <a href="{base}/{lang}/test" class="btn btn-wide btn-primary">
        <span>{introData.startButton}</span>
      </a>
    {/if}
  </div>
{/await}

<!-- Checkbox-driven modal -->
<input
  type="checkbox"
  id="continue_progress_modal"
  class="modal-toggle"
  bind:this={modalCheckbox}
/>

<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Do you clear your progress and start over?</h3>
    <p class="py-4">
      You previously did this test but you did not complete it. If you restart, you will lose your
      progress and can't continue where you left off.
    </p>
    <div class="modal-action">
      <label on:click={removeSession} class="btn btn-secondary">Restart</label>
      <label for="continue_progress_modal" class="btn btn-primary">Cancel</label>
    </div>
  </div>
</div>
