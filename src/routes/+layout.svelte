<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';
  const logo = new URL('../images/glp-logo-head.png', import.meta.url).href;
</script>

<div class="navbar h-30">
  <div class="navbar-start flex-grow">
    <img src={logo} alt="global leadership partners logo" />
  </div>
  <div class="navbar-center flex-grow">
    <h1 class="text-3xl text-white">
      <a href="{base}/" class="btn btn-ghost normal-case text-4xl px-4 py-2">DISC Assessment</a>
    </h1>
  </div>
  <div class="navbar-end flex-grow" />
</div>
<div class="container mx-auto flex flex-col pb-4">
  <slot />
</div>

<style>
  .navbar {
    background-color: #00416b;
    color: white;
    margin-bottom: 2rem;
  }
  img {
    max-width: 20vh;
  }
</style>
