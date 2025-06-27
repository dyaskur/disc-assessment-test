<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import type { IntroductoryText } from '$types/languages';
  import { wordGroupsStore } from '../../stores/wordSet';
  import { goto } from '$app/navigation';
  import { sessionManager } from '../../utils/sessionManager';
  import ConfirmModal from '$components/modals/ConfirmModal.svelte';

  const lang = $page.params.slug;
  let modalRef: ConfirmModal;
  let introData: IntroductoryText;
  let loading = true;
  async function fetchData(): void {
    const response = await fetch(`${base}/languages/${lang}/intro.json`);
    introData = await response.json();
    loading = false;
  }

  let hasProgress = true;
  onMount(async () => {
    fetchData();
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

{#if !loading}
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
{/if}

<ConfirmModal
  bind:this={modalRef}
  title={introData?.restartModalTitle || ''}
  message={introData?.restartModalMessage || ''}
  confirmButton="Restart"
  onRestart={removeSession}
/>
