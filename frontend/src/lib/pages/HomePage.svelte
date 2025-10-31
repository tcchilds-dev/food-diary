<script lang="ts">
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as Form from "$lib/components/ui/form/index.js";
  	import * as Select from "$lib/components/ui/select/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
    
    let { selected = $bindable() } = $props()
    
    // State for view switching
    let currentView = $state('entries'); // 'entries' or 'history'

    // Form state
    let entryType = $state('food'); // 'food', 'symptoms', or 'exercise'

    // Food fields
    let mealType = $state('breakfast');
    let items = $state('');

    // Symptoms fields
    let symptomType = $state('');
    let severity = $state(1);

    // Exercise fields
    let exerciseType = $state('');
    let intensity = $state(1);
    let duration = $state('');
    
    // Common field
    let notes = $state('');
    
    function handleSubmit(e: Event) {
        e.preventDefault();
        const entryData = {
            entryType,
            notes,
            ...(entryType === 'food' && { mealType, items }),
            ...(entryType === 'symptoms' && { symptomType, severity }),
            ...(entryType === 'exercise' && { exerciseType, intensity, duration })
        };
        console.log('Submitting:', entryData);
        // TODO: Send to your backend API
    }
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="#/home">Food Diary</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page>
                                {currentView === 'entries' ? 'Daily Entries' : 'History'}
                            </Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
            <!-- View Toggle -->
            <div class="flex gap-2">
                <Button variant={currentView === 'entries' ? 'default' : 'outline'} onclick={() => currentView = 'entries'}>Daily Entries</Button>
                <Button variant={currentView === 'history' ? 'default' : 'outline'} onclick={() => currentView = 'history'}>History</Button>
            </div>

			<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
                {#if currentView === 'entries'}
                <!-- Daily Entries Form -->
                 <form onsubmit={handleSubmit} class="space-y-6">
                    <div class="space-y-2">
                        <Label for="entry-type">Entry Type</Label>
                        <Select.Root onSelectedChange={(v) => {
                            if (v?.value) entryType = v.value;
                        }}>
                            <Select.Trigger id="entry-type" class="w-full">
                                <span>{entryType.charAt(0).toUpperCase() + entryType.slice(1)}</span>
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="food">Food</Select.Item>
                                <Select.Item value="symptoms">Symptoms</Select.Item>
                                <Select.Item value="exercise">Exercise</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    </div>
    
                    {#if entryType === 'food'}
                    <!--Food Entry Form-->
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <Label>Meal Type</Label>
                            <div class="flex gap-2 flex-wrap">
                                <Button type="button" variant={mealType === 'breakfast' ? 'default' : 'outline'} onclick={() => mealType = 'breakfast'}>Breakfast</Button>
                                <Button type="button" variant={mealType === 'lunch' ? 'default' : 'outline'} onclick={() => mealType = 'lunch'}>Lunch</Button>
                                <Button type="button" variant={mealType === 'dinner' ? 'default' : 'outline'} onclick={() => mealType = 'dinner'}>Dinner</Button>
                                <Button type="button" variant={mealType === 'snack' ? 'default' : 'outline'} onclick={() => mealType = 'snack'}>Snack</Button>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <Label for="items">Food & Drink Items</Label>
                            <Textarea id="items" bind:value={items} placeholder="Enter food and drink items..." rows={4}/>
                        </div>
                    </div>
                    {:else if entryType === 'symptoms'}
                    <!-- Symptoms Entry Form -->
                     <div class="space-y-4">
                        <div class="space-y-2">
                            <Label for="symptom-type">Symptom Type</Label>
                            <Input id="symptom-type" bind:value={symptomType} placeholder="e.g., Bloating, Nausea, Fatigue"/>
                        </div>

                        <div class="space-y-2">
                            <Label>Severity</Label>
                            <div class="flex gap-2">
                                {#each [1, 2, 3, 4, 5] as level}
                                <Button type="button" variant={severity === level ? 'default' : 'outline'} onclick={() => severity = level} class="w-12">{level}</Button>
                                {/each}
                            </div>
                        </div>
                     </div>

                     {:else if entryType === 'exercise'}
                     <!-- Exercise Entry Form -->
                      <div class="space-y-4">
                        <div class="space-y-2">
                            <Label for="exercise-type">Exercise Type</Label>
                            <Input
                                id="exercise-type"
                                bind:value={exerciseType}
                                placeholder="e.g., Running, Swimming, Lifting" />
                        </div>

                        <div class="space-y-2">
                            <Label>Intensity</Label>
                            <div class="flex gap-2">
                                {#each [1, 2, 3, 4, 5] as level}
                                <Button
                                    type="button"
                                    variant={intensity === level ? 'default' : 'outline'}
                                    onclick={() => intensity = level}
                                    class="w-12"
                                >{level}</Button>
                                {/each}
                            </div>
                        </div>

                        <div class="space-y-2">
                            <Label for="duration">Duration</Label>
                            <Input
                                id="duration"
                                type="number"
                                bind:value={duration}
                                placeholder="Minutes"
                                min="1" />
                        </div>
                      </div>
                      {/if}

                      <!-- Notes field for all entry types -->
                       <div class="space-y-2">
                        <Label for="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            bind:value={notes}
                            placeholder="Add any additional notes..."
                            rows={3} />
                       </div>

                       <Button type="submit" class="w-full">Save Entry</Button>
                 </form>
                 {:else}
                 <!-- History View -->
                  <div class="space-y-4">
                    <h2 class="text-2xl font-bold">Entry History</h2>
                    <p class="text-muted-foreground">Your past entries will apear here.</p>
                    <!-- TODO: Add history list/calendar view -->
                  </div>
                  {/if}
            </div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
