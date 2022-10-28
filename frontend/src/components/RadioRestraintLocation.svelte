<script lang="ts">
    import { ProjectRestraintLocationData, projectStore } from "../miscellaneous";
    import { createEventDispatcher } from "svelte";

    export let key: string;
    export let locationData: ProjectRestraintLocationData;
    export let selected: boolean;
    let customClass: string;
    export { customClass as class };

    const dispatch = createEventDispatcher();
    function handleClick() { 
        dispatch("dispatchClick", { key: key })
    }

    let restraintName: string = "";
    $: {
        $projectStore.storage.restraints;
        const restraintData = $projectStore.storage.restraints.data[locationData.initial];
        restraintName = restraintData !== undefined
            ? restraintData.name
            : "";
    }
</script>

<div class={`flex flex-row justify-between space-x-1
    rounded border 
    p-2 pl-4 pr-4
    ${customClass} ${selected === true
        ? "text-slate-200 bg-slate-700 border-slate-600"
        : "text-slate-400 bg-slate-750 border-slate-700"}`}
    on:click={handleClick}>
    <div class="flex flex-col items-start w-9/12">
        <p class="h-6 text-left w-full min-w-0 truncate">{locationData.name}</p>
        <p class={`h-5 text-sm ${selected === true
            ? "text-slate-400"
            : "text-slate-500"}`}>{restraintName}</p>
    </div>
    <div class="flex flex-row items-center h-full">
        <p class={`font-mono ${selected === true
            ? "text-slate-500"
            : "text-slate-600"}`}>
            {key}
        </p>
    </div>
</div>