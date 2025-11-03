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
  import { api } from "$lib/api";
  import { authStore } from "$lib/store/auth.svelte";
  import { getLocalTimeZone, today } from "@internationalized/date";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import type { ComponentProps } from "svelte";
  import {
    FieldGroup,
    FieldLabel,
    FieldDescription,
  } from "$lib/components/ui/field/index.js";

  type Entry =
    | {
        id: number;
        date: string | Date;
        entryType: "food";
        mealType: string;
        foodName: string;
        calories?: number;
        notes?: string;
      }
    | {
        id: number;
        date: string | Date;
        entryType: "symptoms";
        symptomType: string;
        symptomSeverity?: string;
        notes?: string;
      }
    | {
        id: number;
        date: string | Date;
        entryType: "exercise";
        exerciseType: string;
        exerciseDuration?: number;
        notes?: string;
      };

  let entries: Entry[] = $state([]);
  let loading = $state(false);
  let error = $state(null);

  let calendarToday = $state(today(getLocalTimeZone()));

  let { ...restProps }: ComponentProps<typeof Card.Root> = $props();

  const id = $props.id();

  // Form state for food entry
  let foodForm = $state({
    mealType: "",
    foodName: "",
    calories: "",
    notes: "",
  });

  // Form state for symptoms
  let symptomsForm = $state({
    symptomType: "",
    symptomSeverity: "",
    notes: "",
  });

  // Form state for exercise
  let exerciseForm = $state({
    exerciseType: "",
    exerciseIntensity: "",
    exerciseDuration: "",
    notes: "",
  });

  // Check auth on mount
  $effect(() => {
    authStore.checkAuth();
  });

  // Load entries when authenticated
  $effect(() => {
    if (authStore.user && page === "index") {
      loadEntries();
    }
  });

  async function handleFoodSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = null;

    try {
      await api.createEntry({
        entryType: "food",
        date: new Date().toISOString(),
        mealType: foodForm.mealType,
        foodName: foodForm.foodName,
        calories: foodForm.calories ? parseInt(foodForm.calories) : null,
        notes: foodForm.notes || null,
      });

      // Reset form
      foodForm = { mealType: "", foodName: "", calories: "", notes: "" };

      // Reload entries
      await loadEntries();

      // Optionally switch to history view to see the new entry
      view = "history";
    } catch (err: any) {
      error = err.message;
      console.error("Failed to create food entry:", err);
    } finally {
      loading = false;
    }
  }

  async function handleSymptomsSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = null;

    try {
      await api.createEntry({
        entryType: "symptoms",
        date: new Date().toISOString(),
        symptomType: symptomsForm.symptomType,
        symptomSeverity: symptomsForm.symptomSeverity
          ? parseInt(symptomsForm.symptomSeverity)
          : null,
        notes: symptomsForm.notes,
      });

      symptomsForm = { symptomType: "", symptomSeverity: "", notes: "" };
      await loadEntries();
      view = "history";
    } catch (err: any) {
      error = err.message;
      console.error("Failed to create symptoms entry:", err);
    } finally {
      loading = false;
    }
  }

  async function handleExerciseSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = null;

    try {
      await api.createEntry({
        type: "exercise",
        date: new Date().toISOString(),
        exerciseType: exerciseForm.exerciseType,
        exerciseIntensity: exerciseForm.exerciseIntensity
          ? parseInt(exerciseForm.exerciseIntensity)
          : null,
        exerciseDuration: exerciseForm.exerciseDuration
          ? parseInt(exerciseForm.exerciseDuration)
          : null,
        notes: exerciseForm.notes || null,
      });

      exerciseForm = {
        exerciseType: "",
        exerciseIntensity: "",
        exerciseDuration: "",
        notes: "",
      };
      await loadEntries();
      view = "history";
    } catch (err: any) {
      error = err.message;
      console.error("Failed to create exercise entry:", err);
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    // Reset appropriate form based on entryType
    if (entryType === "food") {
      foodForm = { mealType: "", foodName: "", calories: "", notes: "" };
    } else if (entryType === "symptoms") {
      symptomsForm = { symptomType: "", symptomSeverity: "", notes: "" };
    } else if (entryType === "exercise") {
      exerciseForm = {
        exerciseType: "",
        exerciseIntensity: "",
        exerciseDuration: "",
        notes: "",
      };
    }
  }

  async function deleteEntry(id: number) {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await api.deleteEntry(id.toString());
      await loadEntries();
    } catch (err: any) {
      error = err.messages;
      console.error("Failed to delete entry:", err);
    } finally {
      loading = false;
    }
  }

  async function loadEntries() {
    loading = true;
    try {
      entries = await api.getEntries();
    } catch (error) {
      console.error("Failed to lead entries: ", error);
    } finally {
      loading = false;
    }
  }

  async function handleLogin(email: string, password: string) {
    try {
      await authStore.login({ email, password });
      page = "index";
    } catch (error) {
      console.error("Login failed: ", error);
      // Show error to user
    }
  }

  const entryTypes = [
    { value: "foodAndDrink", label: "Food & Drink" },
    { value: "symptoms", label: "Symptoms" },
    { value: "exercise", label: "Exercise" },
  ];

  let page = $state("index");
  let view = $state("entries");
  let entryType = $state("food");

  const triggerContent = $derived(
    entryTypes.find((t) => t.value === entryType)?.label ?? "Entry Type"
  );
</script>

<ModeWatcher />
{#if page === "login"}
  <div class="flex h-screen w-full items-center justify-center px-4">
    <Card.Root class="mx-auto w-full max-w-sm">
      <Card.Header>
        <Card.Title class="text-2xl">Login</Card.Title>
        <Card.Description
          >Enter your email below to login to your account</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <form>
          <FieldGroup>
            <Field.Field>
              <FieldLabel for="email-{id}">Email</FieldLabel>
              <Input
                id="email-{id}"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field.Field>
            <Field.Field>
              <div class="flex items-center">
                <FieldLabel for="password-{id}">Password</FieldLabel>
                <a href="##" class="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <Input id="password-{id}" type="password" required />
            </Field.Field>
            <Field.Field>
              <Button type="submit" class="w-full">Login</Button>
              <FieldDescription class="text-center">
                Don't have an account? <a href="##">Sign up</a>
              </FieldDescription>
            </Field.Field>
          </FieldGroup>
        </form>
      </Card.Content>
    </Card.Root>
  </div>
{:else if page === "signup"}
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <Card.Root {...restProps}>
        <Card.Header>
          <Card.Title>Create an account</Card.Title>
          <Card.Description
            >Enter your information below to create your account</Card.Description
          >
        </Card.Header>
        <Card.Content>
          <form>
            <Field.Group>
              <Field.Field>
                <Field.Label for="name">Full Name</Field.Label>
                <Input id="name" type="text" placeholder="Name McNamerson" />
              </Field.Field>
              <Field.Field>
                <Field.Label for="name">Primary Condition</Field.Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., IBS, IBD, Ceoliac, etc."
                />
              </Field.Field>
              <Field.Field>
                <Field.Label for="email">Email</Field.Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tom@example.com"
                  required
                />
              </Field.Field>
              <Field.Field>
                <Field.Label for="password">Password</Field.Label>
                <Input id="password" type="password" required />
              </Field.Field>
              <Field.Field>
                <Field.Label for="confirm-password"
                  >Confirm Password</Field.Label
                >
                <Input id="confirm-password" type="password" required />
                <Field.Description
                  >Please confirm your password.</Field.Description
                >
              </Field.Field>
              <Field.Group>
                <Field.Field>
                  <Button type="submit">Create Account</Button>
                  <Field.Description class="px-6 text-center">
                    Already have an account? <a href="#/">Sign in</a>
                  </Field.Description>
                </Field.Field>
              </Field.Group>
            </Field.Group>
          </form>
        </Card.Content>
      </Card.Root>
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
            <Calendar
              type="single"
              bind:value={calendarToday}
              class="rounded-lg border shadow-sm"
              numberOfMonths={2}
              captionLayout="label"
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
                <Table.Row></Table.Row>
              </Table.Body>
            </Table.Root>
          </div>
        </div>
        <div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">
          {#if error}
            <div class="bg-destructive/10 text-destructive p-4 m-4 rounded-lg">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onclick={() => (error = null)}
                class="ml-2">Dismiss</Button
              >
            </div>
          {/if}
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
              <form onsubmit={handleFoodSubmit}>
                <Field.Group>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20 pt-10">
                        <Field.Field>
                          <Field.Label for="mealType">Meal Type</Field.Label>
                          <Input
                            id="mealType"
                            bind:value={foodForm.mealType}
                            placeholder="e.g., breakfast, lunch, dinner, snack."
                            required
                          />
                        </Field.Field>
                      </div>
                      <div class="gap-4 pl-12 pr-20">
                        <Field.Field>
                          <Field.Label for="foodName">Food Name</Field.Label>
                          <Input
                            id="foodName"
                            bind:value={foodForm.foodName}
                            placeholder="e.g., mcdonalds large quarter pounder meal"
                            required
                          />
                        </Field.Field>
                      </div>
                      <div class="grid grid-cols-3 gap-4 pl-12">
                        <Field.Field>
                          <Field.Label for="calories">Calories</Field.Label>
                          <Input
                            id="calories"
                            bind:value={foodForm.calories}
                            placeholder="1234"
                            type="number"
                          />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20">
                        <Field.Field>
                          <Field.Label for="foodNotes">Notes</Field.Label>
                          <Textarea
                            id="foodNotes"
                            bind:value={foodForm.notes}
                            placeholder="Add any additional details"
                            class="resize-none"
                          />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <div class="gap-4 pl-12 pr-20">
                    <Field.Field orientation="horizontal">
                      <Button type="submit" disabled={loading}
                        >{loading ? "Submitting..." : "Submit"}</Button
                      >
                      <Button
                        variant="outline"
                        type="button"
                        onclick={handleCancel}>Cancel</Button
                      >
                    </Field.Field>
                  </div>
                </Field.Group>
              </form>
            {:else if entryType === "symptoms"}
              <form onsubmit={handleSymptomsSubmit}>
                <Field.Group>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20 pt-10">
                        <Field.Field>
                          <Field.Label for="symptomType">Symptoms</Field.Label>
                          <Input
                            id="symptomType"
                            bind:value={symptomsForm.symptomType}
                            placeholder="e.g., bloating, pain, nausea, etc."
                            required
                          />
                        </Field.Field>
                      </div>
                      <div class="grid grid-cols-3 gap-4 pl-12">
                        <Field.Field>
                          <Field.Label for="symptomSeverity"
                            >Severity</Field.Label
                          >
                          <Input
                            id="symptomSeverity"
                            bind:value={symptomsForm.symptomSeverity}
                            placeholder="1-5"
                            type="number"
                            min="1"
                            max="5"
                          />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20">
                        <Field.Field>
                          <Field.Label for="symptomsNotes">Notes</Field.Label>
                          <Textarea
                            id="symptomsNotes"
                            bind:value={symptomsForm.notes}
                            placeholder="Add any additional details"
                            class="resize-none"
                          />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <div class="gap-4 pl-12 pr-20">
                    <Field.Field orientation="horizontal">
                      <Button type="submit" disabled={loading}
                        >{loading ? "Submitting..." : "Submit"}</Button
                      >
                      <Button
                        variant="outline"
                        type="button"
                        onclick={handleCancel}>Cancel</Button
                      >
                    </Field.Field>
                  </div>
                </Field.Group>
              </form>
            {:else if entryType === "exercise"}
              <form onsubmit={handleExerciseSubmit}>
                <Field.Group>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20 pt-10">
                        <Field.Field>
                          <Field.Label for="exerciseType"
                            >Exercise Type</Field.Label
                          >
                          <Input
                            id="exerciseType"
                            bind:value={exerciseForm.exerciseType}
                            placeholder="e.g., walking, swimming, lifting, etc."
                            required
                          />
                        </Field.Field>
                      </div>
                      <div class="grid grid-cols-3 gap-4 pl-12">
                        <Field.Field>
                          <Field.Label for="exerciseIntensity"
                            >Intensity</Field.Label
                          >
                          <Input
                            id="exerciseIntensity"
                            bind:value={exerciseForm.exerciseIntensity}
                            placeholder="1-5"
                            type="number"
                            min="1"
                            max="5"
                          />
                        </Field.Field>
                        <Field.Field>
                          <Field.Label for="exerciseDuration"
                            >Duration</Field.Label
                          >
                          <Input
                            id="exerciseDuration"
                            bind:value={exerciseForm.exerciseDuration}
                            placeholder="minutes"
                            type="number"
                          />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <Field.Set>
                    <Field.Group>
                      <div class="gap-4 pl-12 pr-20">
                        <Field.Field>
                          <Field.Label for="exerciseNotes">Notes</Field.Label>
                          <Textarea
                            id="exerciseNotes"
                            bind:value={exerciseForm.notes}
                            placeholder="Add any additional details"
                            class="resize-none"
                          />
                        </Field.Field>
                      </div>
                    </Field.Group>
                  </Field.Set>
                  <div class="gap-4 pl-12 pr-20">
                    <Field.Field orientation="horizontal">
                      <Button type="submit" disabled={loading}
                        >{loading ? "Submitting..." : "Submit"}</Button
                      >
                      <Button
                        variant="outline"
                        type="button"
                        onclick={handleCancel}>Cancel</Button
                      >
                    </Field.Field>
                  </div>
                </Field.Group>
              </form>
            {/if}
          {:else if view === "history"}
            {#if loading}
              <div class="p-12">Loading entries...</div>
            {:else if error}
              <div class="p-12 text-destructive">Error: {error}</div>
            {:else if entries.length === 0}
              <div class="p-12">No entries yet. Create your first entry!</div>
            {:else}
              <Table.Root>
                <Table.Caption>A list of your recent entries.</Table.Caption>
                <Table.Header>
                  <Table.Row>
                    <Table.Head class="w-[120px] pl-3">Date</Table.Head>
                    <Table.Head class="w-[100px]">Type</Table.Head>
                    <Table.Head>Details</Table.Head>
                    <Table.Head>Notes</Table.Head>
                    <Table.Head class="w-[100px]">Actions</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {#each entries as entry: Entry}
                    <Table.Row>
                      <Table.Cell class="font-medium pl-3">
                        {new Date(entry.date).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell class="capitalize"
                        >{entry.entryType}</Table.Cell
                      >
                      <Table.Cell>
                        {#if entry.entryType === "food"}
                          {entry.mealType}: {entry.foodName}
                          {#if entry.calories}({entry.calories} cal){/if}
                        {:else if entry.entryType === "symptoms"}
                          {entry.symptomType}
                          {#if entry.symptomSeverity}(Severity: {entry.symptomSeverity ||
                              "N/A"}){/if}
                        {:else if entry.entryType === "exercise"}
                          {entry.exerciseType}
                          {#if entry.exerciseDuration}- {entry.exerciseDuration}min{/if}
                        {/if}
                      </Table.Cell>
                      <Table.Cell>{entry.notes || "-"}</Table.Cell>
                      <Table.Cell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onclick={() => deleteEntry(entry.id)}
                        >
                          Delete
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  {/each}
                </Table.Body>
              </Table.Root>
            {/if}
          {/if}
        </div>
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
