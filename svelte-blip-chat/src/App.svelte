<script lang="ts">
	import { Router, Link, Route } from "svelte-routing";
	import { onMount } from "svelte";
	import { auth } from "./firebase";
	import { user } from "./stores/auth";
	import Login from "./routes/Login.svelte";
	import Contacts from "./routes/Contacts.svelte";
	import Conversation from "./routes/Conversation.svelte";
  
	export let url = "";
  
	onMount(() => {
	  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
		user.set(currentUser);
	  });
  
	  return () => unsubscribe();
	});
  </script>
  
  <Router {url}>
	<nav class="bg-blue-500 p-4">
	  <Link to="/" class="text-white mr-4">Home</Link>
	  {#if $user}
		<button on:click={() => auth.signOut()} class="text-white">Logout</button>
	  {:else}
		<Link to="/login" class="text-white">Login</Link>
	  {/if}
	</nav>
  
	<main class="container mx-auto mt-4">
	  <Route path="/login" component={Login} />
	  <Route path="/" component={Contacts} />
	  <Route path="/contato/:id" component={Conversation} />
	</main>
  </Router>