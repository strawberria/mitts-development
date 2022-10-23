<script lang="ts">
    import RestraintSelector from "../sections/RestraintSelector.svelte";
    import RestraintLocationCurrent from "../sections/RestraintLocationCurrent.svelte";
    import RestraintLocationSelector from "../sections/RestraintLocationSelector.svelte";
    import RestraintCurrent from "../sections/RestraintCurrent.svelte";

    let selectedLocationID: string;
    let selectedRestraintID: string;
</script>

<div class="flex flex-row space-x-4
    h-full w-full">
    <div class="flex flex-col space-y-4
        h-full" style="width: 30%">
        <RestraintLocationSelector bind:selectedLocationID={selectedLocationID} />
        {#if selectedLocationID !== undefined}
            <RestraintLocationCurrent selectedLocationID={selectedLocationID} />
        {/if}
    </div>
    <div class="flex flex-col space-y-4
        h-full" style="width: 30%">
        <RestraintSelector bind:selectedRestraintID={selectedRestraintID} />
    </div>
    <div class="grow flex flex-col space-y-4
        h-full">
        {#if selectedRestraintID !== undefined}
            <RestraintCurrent selectedRestraintID={selectedRestraintID} />
        {/if}
    </div>
</div>