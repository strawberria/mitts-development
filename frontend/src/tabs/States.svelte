<script lang="ts">
    import StateCurrent from "../sections/StateCurrent.svelte";
    import StateSelector from "../sections/StateSelector.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import { stateStore } from "../miscellaneous";

    let selectedActionID: string;
</script>

<div class="flex flex-row space-x-4
    h-full w-full">
    <div class="flex flex-col space-y-4
        h-full" style="width: 30%">
        <FormGrouping>
            <svelte:fragment slot="content">
                <p>Tip: Copy states (instead of creating new ones) to preserve interactions and minimap data for less hassle!</p>
            </svelte:fragment>
        </FormGrouping>
        <StateSelector bind:selectedStateID={$stateStore} />
    </div>
    <!-- Forced width to keep from expanding with image -->
    <div class="flex flex-col space-y-4
        h-full" style="width: calc(70% - 1em)">
        {#if $stateStore !== undefined && $stateStore !== ""}
            <StateCurrent selectedStateID={$stateStore} />
        {/if}
    </div>
</div>