<script lang="ts">
  import "./app.css";
  import LoginForm from "$lib/components/login-form.svelte";
  import SignupForm from "$lib/components/signup-form.svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import RangeCalendar from "$lib/components/ui/range-calendar/range-calendar.svelte";
  import { CalendarDate } from "@internationalized/date";
  import type { DateRange } from "bits-ui";
  import * as Table from "$lib/components/ui/table/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import { toggleMode } from "mode-watcher";

  let value = $state<DateRange>({
    start: new CalendarDate(2025, 6, 12),
    end: new CalendarDate(2025, 7, 15),
  });

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
        <div class="flex items-center gap-2 px-4">
          <h1
            class="scroll-m-20 text-4xl font-extrabold tracking-tight text-center text-rose-500"
          >
            Food Diary
          </h1>
        </div>
        <div class="flex items-center gap-2 px-4">
          <Tabs.Root value="entries" class="w-[400px]">
            <Tabs.List>
              <Tabs.Trigger value="entries">Daily Entries</Tabs.Trigger>
              <Tabs.Trigger value="History">History</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>
        <div class="flex items-center gap-2 px-4">
          <Button onclick={toggleMode} variant="outline" size="icon">
            <SunIcon
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
            />
            <MoonIcon
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
      <div class="flex flex-1 flex-row gap-4 p-4 pt-0">
        <div class="grid auto-rows-min gap-4 md:grid-rows-3">
          <div class="bg-muted/50 aspect-video rounded-xl">
            <RangeCalendar
              bind:value
              class="rounded-lg border shadow-sm"
              numberOfMonths={2}
            />
          </div>
          <div class="bg-muted/50 aspect-video rounded-xl">
            <Table.Root>
              <Table.Caption>A list of your recent symptoms.</Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.Head class="w-[100px]">Date</Table.Head>
                  <Table.Head>Symptoms</Table.Head>
                  <Table.Head></Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell class="font-medium">29/12/1995</Table.Cell>
                  <Table.Cell>Bloating, Pain, Nausea</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </div>
        </div>
        <div
          class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"
        ></div>
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
