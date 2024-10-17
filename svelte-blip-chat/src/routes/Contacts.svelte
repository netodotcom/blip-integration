<script lang="ts">
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { auth } from "../firebase";
  import { user } from "../stores/auth";

  let contacts = [];
  let currentPage = 1;
  let totalPages = 1;
  let contactsPerPage = 10;

  onMount(async () => {
    if ($user) {
      await loadContacts();
    }
  });

  async function loadContacts() {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`/api/contacts?page=${currentPage}&perPage=${contactsPerPage}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      contacts = data.contacts;
      totalPages = data.totalPages;
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      loadContacts();
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      loadContacts();
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">Contacts</h1>

{#if $user}
  <ul class="divide-y divide-gray-200">
    {#each contacts as contact}
      <li class="py-4">
        <Link to={`/contato/${contact.id}`} class="block hover:bg-gray-100 p-2 rounded">
          {contact.name}
        </Link>
      </li>
    {/each}
  </ul>

  <div class="mt-4 flex justify-between">
    <button
      on:click={prevPage}
      disabled={currentPage === 1}
      class="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
    >
      Previous
    </button>
    <span>Page {currentPage} of {totalPages}</span>
    <button
      on:click={nextPage}
      disabled={currentPage === totalPages}
      class="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
{:else}
  <p>Please log in to view contacts.</p>
{/if}