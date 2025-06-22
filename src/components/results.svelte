<script lang="ts">
  import { wordGroupsStore } from '../stores/wordSet';
  import { onMount } from 'svelte';
  import Chart from './chart.svelte';
  import type { WordGroupData, AssessmentResultText } from '$types/languages';

  export let resultsLanguage: AssessmentResultText;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let html2pdf: any = null;
  onMount(async () => {
    if (typeof window !== 'undefined') {
      const module = await import('html2pdf.js');
      html2pdf = module.default;
    }
  });

  async function saveScreenshot() {
    const element = document.getElementById('results');
    const opt = {
      margin: 0,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, windowWidth: 1024 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).outputPdf().save();
  }

  type Point = {
    id: number;
    trait: string;
    weight: number;
    color: string;
  };

  async function calculatePoints(store: WordGroupData['wordGroups']) {
    const points: Point[] = resultsLanguage.attributes.map((attr, index) => ({
      id: index,
      trait: attr.name,
      weight: 0,
      color: attr.color
    }));

    store.forEach((page) => {
      page.words.forEach((word, index) => {
        if (points[index]) {
          points[index] = {
            ...points[index],
            weight: points[index].weight + (word.rank ?? 0)
          };
        }
      });
    });

    return {
      points,
      // sort points by weight
      sortedPoints: points.slice().sort((a, b) => b.weight - a.weight)
    };
  }
</script>

{#await calculatePoints($wordGroupsStore) then { points, sortedPoints }}
  <div id="results">
    <h1 class="text-3xl md:text-4xl">{resultsLanguage.heading}</h1>

    <div class="container mx-auto results">
      <p>
        {resultsLanguage.primaryText}:
        <span style="text-transform: uppercase; font-weight: 600; color: {sortedPoints[0].color}"
          >{sortedPoints[0].trait}</span
        >
      </p>
      <p>
        {resultsLanguage.secondaryText}:
        <span style="text-transform: uppercase; font-weight: 600; color: {sortedPoints[1].color}"
          >{sortedPoints[1].trait}</span
        >
      </p>
    </div>
    <div class="container mx-auto" style="max-width:900px">
      {#each resultsLanguage.attributes as attribute}
        <p>
          <span style="text-transform: uppercase; font-weight: 600; color:{attribute.color}"
            >{attribute.name}</span
          >
          - {attribute.definition}
        </p>
      {/each}
      <p>{resultsLanguage.descriptionText}</p>
      <Chart {resultsLanguage} data={points.map((points) => points.weight)} />
    </div>
  </div>
  <div style="display: flex;margin: 0 auto;justify-content: center; margin-top: 2rem">
    <button on:click={() => saveScreenshot()} class="btn btn-wide btn-primary"
      >{resultsLanguage.button}</button
    >
  </div>
{/await}

<style>
  h1 {
    text-align: center;
  }

  .results {
    text-align: center;
    padding-bottom: 3vh;
  }
</style>
