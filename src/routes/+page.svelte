<script lang="ts">
  import { base } from '$app/paths';
  export let data: { languages: typeof import('../../static/languages/list.json') };
  const { languages } = data;
</script>

<div class="flex flex-row flex-wrap justify-center">
  {#each Object.entries(languages) as [lang, values]}
    <a href="{base}/{lang}" class="btn md:btn-md lg:btn-lg text-white basis-1/4"
      ><span {lang}>{values.name}</span></a
    >
  {/each}
</div>

<style>
  .btn {
    background-color: #46709f;
    margin: 0.3rem;
  }
</style>
