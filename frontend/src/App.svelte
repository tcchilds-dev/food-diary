<script lang="ts">
  import Router from "svelte-spa-router"
  import { wrap } from 'svelte-spa-router/wrap'
  import './app.css';
  import Login from "./lib/pages/Login.svelte"
  import SignUp from "./lib/pages/SignUp.svelte"
  import HomePage from "./lib/pages/HomePage.svelte"
  import DailyEntries from "./lib/pages/DailyEntries.svelte"
  import History from "./lib/pages/History.svelte"
  
  let isAuthenticated = $state(false);

  function handleLogin() {
    isAuthenticated = true;
  }
  
  function handleLogout() {
    isAuthenticated = false;
    window.location.hash = '/login';
  }
  
  // Define routes
  const routes = {
    '/': wrap({
      component: Login,
      props: { handleLogin }
    }),
    '/login': wrap({
      component: Login,
      props: {handleLogin}
    }),
    '/signup': wrap({
      component: SignUp,
      props: { handleLogin }
    }),
    '/home': HomePage
  };
</script>

{#if !isAuthenticated && (window.location.hash === '#/' || window.location.hash === '#/login' || window.location.hash === '#/signup' || window.location.hash === '')}
  <Router {routes} />
{:else if isAuthenticated}
  <nav class="p-4 border-b flex gap-4">
    <a href="#/home">Home</a>
    <a href="#/entries">Daily Entries</a>
    <a href="#/history">History</a>
    <button onclick={handleLogout}>Logout</button>
  </nav>
  
  <main class="p-4">
    <Router {routes} />
  </main>
{:else}
  <!-- Redirect to login if trying to access protected routes while not authenticated -->
  {window.location.hash = '#/login'}
{/if}
  