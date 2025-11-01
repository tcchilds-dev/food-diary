<script lang="ts">
  import "./app.css";
  import LoginForm from "$lib/components/login-form.svelte";
  import SignupForm from "$lib/components/signup-form.svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { CalendarDate } from "@internationalized/date";

  let value = $state<CalendarDate | undefined>(new CalendarDate(2025, 6, 12));

  let page = "index";
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
{:else if page === "index"}
  <Sidebar.Provider>
    <Sidebar.Inset>
      <header class="flex h-16 shrink-0 items-center gap-2">
        <div class="flex items-center gap-2 px-4"></div>
      </header>
      <div class="flex flex-1 flex-row gap-4 p-4 pt-0">
        <div class="grid auto-rows-min gap-4 md:grid-rows-3">
          <div class="bg-muted/50 aspect-video rounded-xl">
            <Calendar
              type="single"
              bind:value
              class="rounded-lg border shadow-sm"
            />
          </div>
          <div class="bg-muted/50 aspect-video rounded-xl"></div>
          <div class="bg-muted/50 aspect-video rounded-xl"></div>
        </div>
        <div
          class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"
        ></div>
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
