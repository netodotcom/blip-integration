<script lang="ts">
  import { navigate } from "svelte-routing";
  import { auth } from "../firebase";
  import { signInWithCustomToken } from "firebase/auth";
  import { z } from "zod";

  let apiKey = "";
  let error = "";

  const apiKeySchema = z.string().min(1, "API Key is required");

  async function handleSubmit() {
    try {
      apiKeySchema.parse(apiKey);
      const response = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        const { token } = await response.json();
        await signInWithCustomToken(auth, token);
        navigate("/");
      } else {
        error = "Invalid API Key";
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        error = err.errors[0].message;
      } else {
        error = "An error occurred. Please try again.";
      }
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="max-w-md mx-auto">
  <h1 class="text-2xl font-bold mb-4">Login</h1>
  <div class="mb-4">
    <label for="apiKey" class="block mb-2">Blip API Key</label>
    <input
      type="password"
      id="apiKey"
      bind:value={apiKey}
      class="w-full p-2 border rounded"
    />
  </div>
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}
  <button type="submit" class="bg-blue-500 text-white p-2 rounded">
    Login
  </button>
</form>