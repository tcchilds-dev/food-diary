<!-- turn back if you value your sanity -->

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
  import { ModeWatcher } from "mode-watcher";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  const entryTypes = [
    { value: "foodAndDrink", label: "Food & Drink" },
    { value: "symptoms", label: "Symptoms" },
    { value: "exercise", label: "Exercise" },
  ];

  let value = $state<DateRange>({
    start: new CalendarDate(2025, 6, 12),
    end: new CalendarDate(2025, 7, 15),
  });

  let page = "index";
  let view = $state("entries");
  let entryType = $state("food");

  const triggerContent = $derived(
    entryTypes.find((t) => t.value === value)?.label ?? "Entry Type"
  );
</script>

<ModeWatcher />
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
        <div class="flex-1"></div>
        <Tabs.Root bind:value={view} class="w-[400px]">
          <Tabs.List>
            <Tabs.Trigger value="entries">Daily Entries</Tabs.Trigger>
            <Tabs.Trigger value="history">History</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <div class="flex-1"></div>
        <Button onclick={toggleMode} variant="outline" size="icon" class="mr-4">
          <SunIcon
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
          />
          <MoonIcon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
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
                  <Table.Head class="w-[100px] pl-3">Date</Table.Head>
                  <Table.Head>Symptoms</Table.Head>
                  <Table.Head></Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell class="font-medium pl-3">29/12/1995</Table.Cell>
                  <Table.Cell>Bloating, Pain, Nausea</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </div>
        </div>
        <div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">
          {#if view === "entries"}
            <div class="gap-4 pl-12 pr-20 pt-12">
              <Tabs.Root bind:value={entryType} class="w-[400px]">
                <Tabs.List>
                  <Tabs.Trigger value="food">Food & Drink</Tabs.Trigger>
                  <Tabs.Trigger value="symptoms">Symptoms</Tabs.Trigger>
                  <Tabs.Trigger value="exercise">Exercise</Tabs.Trigger>
                </Tabs.List>
              </Tabs.Root>
            </div>
            {#if entryType === "food"}
              <form>
                <Field.Group>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20 pt-10">
                        <Field.Field>
                          <Field.Label for="placeholder">Meal Type</Field.Label>
                          <Input
                            id="placeholder"
                            placeholder="e.g., breakfast, lunch, dinner, snack."
                            required
                          />
                        </Field.Field>
                      </div>
                      <div class="gap-4 pl-12 pr-20">
                        <Field.Field>
                          <Field.Label for="placeholder">Meal Name</Field.Label>
                          <Input
                            id="placeholder"
                            placeholder="e.g., mcdonalds large quarter pounder meal"
                            required
                          />
                        </Field.Field>
                      </div>
                      <div class="grid grid-cols-3 gap-4 pl-12">
                        <Field.Field>
                          <Field.Label for="placeholder">Calories</Field.Label>
                          <Input id="placeholder" placeholder="1234" />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20">
                        <Field.Field>
                          <Field.Label for="placeholder">Notes</Field.Label>
                          <Textarea
                            id="placeholder"
                            placeholder="Add any additional details"
                            class="resize-none"
                          />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <div class="gap-4 pl-12 pr-20">
                    <Field.Field orientation="horizontal">
                      <Button type="submit">Submit</Button>
                      <Button variant="outline" type="button">Cancel</Button>
                    </Field.Field>
                  </div>
                </Field.Group>
              </form>
            {:else if entryType === "symptoms"}
              <form>
                <Field.Group>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20 pt-10">
                        <Field.Field>
                          <Field.Label for="placeholder">Symptoms</Field.Label>
                          <Input
                            id="placeholder"
                            placeholder="e.g., bloating, pain, nausea, etc."
                            required
                          />
                        </Field.Field>
                      </div>
                      <div class="grid grid-cols-3 gap-4 pl-12">
                        <Field.Field>
                          <Field.Label for="placeholder">Severity</Field.Label>
                          <Input id="placeholder" placeholder="1-5" />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20">
                        <Field.Field>
                          <Field.Label for="placeholder">Notes</Field.Label>
                          <Textarea
                            id="placeholder"
                            placeholder="Add any additional details"
                            class="resize-none"
                          />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <div class="gap-4 pl-12 pr-20">
                    <Field.Field orientation="horizontal">
                      <Button type="submit">Submit</Button>
                      <Button variant="outline" type="button">Cancel</Button>
                    </Field.Field>
                  </div>
                </Field.Group>
              </form>
            {:else if entryType === "exercise"}
              <form>
                <Field.Group>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20 pt-10">
                        <Field.Field>
                          <Field.Label for="placeholder"
                            >Exercise Type</Field.Label
                          >
                          <Input
                            id="placeholder"
                            placeholder="e.g., walking, swimming, lifting, etc."
                            required
                          />
                        </Field.Field>
                      </div>
                      <div class="grid grid-cols-3 gap-4 pl-12">
                        <Field.Field>
                          <Field.Label for="placeholder">Intensity</Field.Label>
                          <Input id="placeholder" placeholder="1-5" />
                        </Field.Field>
                        <Field.Field>
                          <Field.Label for="placeholder">Duration</Field.Label>
                          <Input id="placeholder" placeholder="minutes" />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20">
                        <Field.Field>
                          <Field.Label for="placeholder">Notes</Field.Label>
                          <Textarea
                            id="placeholder"
                            placeholder="Add any additional details"
                            class="resize-none"
                          />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <div class="gap-4 pl-12 pr-20">
                    <Field.Field orientation="horizontal">
                      <Button type="submit">Submit</Button>
                      <Button variant="outline" type="button">Cancel</Button>
                    </Field.Field>
                  </div>
                </Field.Group>
              </form>
            {/if}
          {:else if view === "history"}
            <Table.Root>
              <Table.Caption>A list of your recent entries.</Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.Head class="w-[100px] pl-3">Date</Table.Head>
                  <Table.Head>Food & Drink</Table.Head>
                  <Table.Head>Symptoms</Table.Head>
                  <Table.Head>Exercise</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell class="font-medium pl-3">29/12/1995</Table.Cell>
                  <Table.Cell>Cheese</Table.Cell>
                  <Table.Cell>Cheese Dreams</Table.Cell>
                  <Table.Cell>Running</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          {/if}
        </div>
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
