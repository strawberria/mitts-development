<script lang="ts">
    import InteractionSelector from "../sections/InteractionSelector.svelte";
    import InteractionCurrent from "../sections/InteractionCurrent.svelte";
    import InteractionCriteriaSelector from "../sections/InteractionCriteriaSelector.svelte";
    import InteractionResultSelector from "../sections/InteractionResultSelector.svelte";
    import InteractionCriteriaCurrent from "../sections/InteractionCriteriaCurrent.svelte";
    import InteractionResultCurrent from "../sections/InteractionResultCurrent.svelte";
    import { projectStore, stateStore } from "../miscellaneous";

    let selectedInteractionID: string | undefined;
    let selectedCriteriaID: string | undefined;
    let selectedResultID: string | undefined;

    let previousStateID: string | undefined;
    $: {
        previousStateID;
        if(previousStateID !== $stateStore) {
            selectedInteractionID = undefined;
            selectedCriteriaID = undefined;
            selectedResultID = undefined;
            
            previousStateID = $stateStore;
        }
    }
</script>

{#if $stateStore === undefined}
    <div class="flex flex-col justify-center
        w-full h-full">
        <p class="text-2xl text-slate-300">Select a state from [States] first</p>
    </div>
{:else if $projectStore.storage.states.data[$stateStore].type === "opening"
    || $projectStore.storage.states.data[$stateStore].type === "ending"}
    <div class="flex flex-col justify-center
        w-full h-full">
        <p class="text-2xl text-slate-300">Cannot setup interactions for {$projectStore.storage.states.data[$stateStore].type} state</p>
        <p class="text-2xl text-slate-300">Select another state from [States]</p>
    </div>
{:else}
    <div class="flex flex-row space-x-4
        h-full w-full">
        <div class="grow flex flex-col space-y-4
            h-full">
            <InteractionSelector selectedStateID={$stateStore}
                bind:selectedInteractionID={selectedInteractionID} />
            {#if selectedInteractionID !== undefined}
                <InteractionCurrent selectedStateID={$stateStore}
                    selectedInteractionID={selectedInteractionID} />
            {/if}
        </div>
        <div class="flex flex-col space-y-4
            h-full" style="width: 30%; min-width: 30%">
            {#if selectedInteractionID !== undefined}
                <InteractionCriteriaSelector class="h-1/3" 
                    selectedStateID={$stateStore}
                    selectedInteractionID={selectedInteractionID}
                    bind:selectedCriteriaID={selectedCriteriaID} />
                {#if selectedCriteriaID !== undefined}
                    <InteractionCriteriaCurrent selectedStateID={$stateStore}
                        selectedInteractionID={selectedInteractionID}
                        selectedCriteriaID={selectedCriteriaID} />
                {/if}
            {/if}
        </div>
        <div class="flex flex-col space-y-4
            h-full" style="width: 30%; min-width: 30%">
            {#if selectedInteractionID !== undefined}
                <InteractionResultSelector class="h-1/3" 
                    selectedStateID={$stateStore}
                    selectedInteractionID={selectedInteractionID}
                    bind:selectedResultID={selectedResultID} />
                {#if selectedResultID !== undefined}
                    <InteractionResultCurrent selectedStateID={$stateStore}
                        selectedInteractionID={selectedInteractionID}
                        selectedResultID={selectedResultID} />
                {/if}
            {/if}
        </div>
    </div>
{/if}