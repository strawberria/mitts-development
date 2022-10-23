<script lang="ts">
    import ObjectSelector from "../sections/ObjectSelector.svelte";
    import ObjectCurrent from "../sections/ObjectCurrent.svelte";

    let selectedObjectID: string;
</script>

<div class="flex flex-row space-x-4
    h-full w-full">
    <div class="flex flex-col space-y-4
        h-full" style="width: 30%">
        <ObjectSelector bind:selectedObjectID={selectedObjectID} />
    </div>
    <div class="grow flex flex-col space-y-4
        h-full">
        {#if selectedObjectID !== undefined}
            <ObjectCurrent selectedObjectID={selectedObjectID} />
        {/if}
    </div>
</div>