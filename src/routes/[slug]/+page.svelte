<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import type { CommonStrings, IntroductoryText } from '$types/languages';
  import { wordGroupsStore } from '../../stores/wordSet';
  import { goto } from '$app/navigation';
  import { sessionManager } from '../../utils/sessionManager';
  import ConfirmModal from '$components/modals/ConfirmModal.svelte';

  const lang = $page.params.slug;
  let modalRef: ConfirmModal;
  type PageData = {
    common: CommonStrings;
    intro: IntroductoryText;
  };
  export let data: PageData;
  const { common, intro } = data;

  let hasProgress = true;
  onMount(async () => {
    console.log('onMount', data);
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
    modalRef.open(); // Call method exposed from child
  }
</script>

<div class="flex-none flex justify-center mx-5">
  <h1 class="text-3xl md:text-4xl">{intro.heading}</h1>
</div>

<div class="flex-none sm:container sm:mx-auto mx-10">
  <p>
    {intro.introduction}
  </p>
</div>

<div class="flex-1 flex flex-col items-center mt-6 space-y-4">
  {#if hasProgress}
    <a href="{base}/{lang}/test" class="btn btn-wide btn-primary">
      <span>{intro.continueButton}</span>
    </a>
    <a href="#" on:click={openModal} class="btn btn-wide btn-secondary">
      <span>{intro.restartButton}</span>
    </a>
  {:else}
    <a href="{base}/{lang}/test" class="btn btn-wide btn-primary">
      <span>{intro.startButton}</span>
    </a>
  {/if}
</div>

<ConfirmModal
  bind:this={modalRef}
  title={intro?.restartModalTitle || ''}
  message={intro?.restartModalMessage || ''}
  confirmButton={common.restart}
  onRestart={removeSession}
/>
