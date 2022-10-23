<script lang="ts">
    import MinimapDisplay from "../sections/MinimapDisplay.svelte";
    import MinimapLocationSelector from "../sections/MinimapLocationSelector.svelte";
    import MinimapLocationCurrent from "../sections/MinimapLocationCurrent.svelte";
    import MinimapObjectSelector from "../sections/MinimapObjectSelector.svelte";
    import { projectStore, stateStore } from "../miscellaneous";

    let selectedMinimapObjectID: string | undefined;
    let selectedMinimapLocationID: string | undefined;

    let previousStateID: string | undefined;
    let previousMinimapLocationID: string | undefined;
    $: {
        previousStateID;
        previousMinimapLocationID;
        if(previousStateID !== $stateStore) {
            selectedMinimapLocationID = undefined;
            selectedMinimapObjectID = undefined;
            previousStateID = $stateStore;
        }
        if(previousMinimapLocationID !== selectedMinimapLocationID) {
            selectedMinimapObjectID = undefined;
            previousMinimapLocationID = selectedMinimapLocationID;
        }
    }
</script>

{#if $stateStore === undefined}
    <div class="flex flex-col justify-center
        w-full h-full">
        <p class="text-2xl text-slate-300">Select a state from [States] first</p>
    </div>
{:else if $projectStore.storage.states.data[$stateStore].type === "opening"
    || $projectStore.storage.states.data[$stateStore].type === "intermediate"
    || $projectStore.storage.states.data[$stateStore].type === "ending"}
    <div class="flex flex-col justify-center
        w-full h-full">
        <p class="text-2xl text-slate-300">Cannot setup minimap for {$projectStore.storage.states.data[$stateStore].type} state</p>
        <p class="text-2xl text-slate-300">Select another state from [States]</p>
    </div>
{:else}
    <div class="flex flex-row space-x-4
        h-full w-full">
        <div class="flex flex-col space-y-4
            h-full" style="width: 30%">
            <div class="flex flex-col 
                h-1/4 w-full">
                <MinimapLocationSelector selectedStateID={$stateStore}
                    bind:selectedMinimapLocationID={selectedMinimapLocationID} />
            </div>
            <div class="flex flex-col 
                h-1/5 w-full">
                {#if selectedMinimapLocationID !== undefined}
                    <MinimapLocationCurrent selectedStateID={$stateStore}
                        selectedMinimapLocationID={selectedMinimapLocationID} />
                {/if}
            </div>
            <div class="flex flex-col 
                grow w-full">
                {#if selectedMinimapLocationID !== undefined}
                    <MinimapObjectSelector selectedStateID={$stateStore}
                        selectedMinimapLocationID={selectedMinimapLocationID}
                        bind:selectedMinimapObjectID={selectedMinimapObjectID} />
                {/if}
            </div>
        </div>
        <div class="grow flex flex-col space-y-4
            h-full">
            {#if selectedMinimapLocationID !== undefined}
                <MinimapDisplay selectedStateID={$stateStore} 
                    selectedMinimapLocationID={selectedMinimapLocationID}
                    selectedMinimapObjectID={selectedMinimapObjectID} />
            {/if}
        </div>
    </div>
{/if}