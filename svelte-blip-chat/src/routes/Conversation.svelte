<script lang="ts">
  import { onMount } from "svelte";
  import { auth } from "../firebase";
  import { user } from "../stores/auth";

  export let id;
  let messages = [];

  onMount(async () => {
    if ($user) {
      await loadConversation();
    }
  });

  async function loadConversation() {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`/api/conversation/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      messages = await response.json();
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">Conversation</h1>

{#if $user}
  <div class="space-y-4">
    {#each messages as message}
      <div class={`p-4 rounded-lg ${message.direction === 'incoming' ? 'bg-blue-100' : 'bg-green-100'}`}>
        <p class="font-bold">{message.direction === 'incoming' ? 'User' : 'Bot'}</p>
        <p>{message.content}</p>
        <p class="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
      </div>
    {/each}
  </div>
{:else}
  <p>Please log in to view the conversation.</p>
{/if}