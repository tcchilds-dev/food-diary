<script lang="ts">
  import "./app.css";
  import LoginForm from "$lib/components/login-form.svelte";
  import SignupForm from "$lib/components/signup-form.svelte";

  let page = "signup";
</script>

{#if page === "login"}
  <div class="flex h-screen w-full items-center justify-center px-4">
    <LoginForm />
  </div>
{:else if page === "signup"}
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <SignupForm />
    </div>
  </div>
{/if}
