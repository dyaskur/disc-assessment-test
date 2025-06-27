<script lang="ts">
  export let title = '';
  export let message = '';
  export let confirmButton = '';
  export let onRestart: (event: MouseEvent) => void;

  let modal: HTMLDialogElement;
  export function open() {
    modal.showModal();
  }
  export function close() {
    modal.close();
  }
</script>

<dialog id="my_modal_1" bind:this={modal} class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">{title}</h3>
    <p class="py-4">{message}</p>
    <div class="modal-action">
      <button
        on:click={(e) => {
          onRestart(e);
          close();
        }}
        class="btn btn-warning">{confirmButton}</button
      >
      <button on:click={close} class="btn btn-primary">CANCEL</button>
    </div>
  </div>
</dialog>
