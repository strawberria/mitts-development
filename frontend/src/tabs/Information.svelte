<script lang="ts">
    import InformationGame from "../sections/InformationGame.svelte";
    import InformationActionSelector from "../sections/InformationActionSelector.svelte";
    import InformationActionCurrent from "../sections/InformationActionCurrent.svelte";

    let selectedActionID: string;
</script>

<div class="flex flex-row space-x-4
    h-full w-full">
    <div class="flex flex-col space-y-4
        h-full" style="width: 30%">
        <InformationActionSelector bind:selectedActionID={selectedActionID} />
        {#if selectedActionID !== undefined && selectedActionID !== ""}
            <InformationActionCurrent selectedActionID={selectedActionID} />
        {/if}
    </div>
    <div class="flex flex-col space-y-4
        h-full" style="width: 35%">
        <InformationGame />
    </div>
</div>