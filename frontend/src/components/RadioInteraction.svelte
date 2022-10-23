<script lang="ts">
    import { ProjectInteractionData, projectStore } from "../miscellaneous";
    import { createEventDispatcher } from "svelte";
    import { stateStore } from "../miscellaneous";

    export let key: string;
    export let interactionData: ProjectInteractionData;
    export let selected: boolean;
    let customClass: string;
    export { customClass as class };

    const dispatch = createEventDispatcher();
    function handleClick() { 
        dispatch("dispatchClick", { key: key })
    }

    let actionName: string = "";
    $: {
        $projectStore.data.actions;
        $projectStore.storage.states.data[$stateStore].interactions;
        const actionData = $projectStore.data.actions.data[interactionData.action];
        actionName = actionData !== undefined
            ? actionData.name
            : "";
    }

    let component1Name: string = "";
    $: {
        $projectStore.data.restraintLocations;
        $projectStore.storage.restraints;
        $projectStore.storage.objects;
        $projectStore.storage.states.data[$stateStore].interactions;
        
        component1Name = "";
        if($projectStore.data.restraintLocations.data[interactionData.components[0]] !== undefined) {
            component1Name = `(L) ${$projectStore.data.restraintLocations.data[interactionData.components[0]].name}`;
        } else if($projectStore.storage.restraints.data[interactionData.components[0]] !== undefined) {
            component1Name = `(R) ${$projectStore.storage.restraints.data[interactionData.components[0]].devName}`;
        } else if($projectStore.storage.objects.data[interactionData.components[0]] !== undefined) {
            component1Name = `(O) ${$projectStore.storage.objects.data[interactionData.components[0]].devName}`;
        }
    }

    let component2Name: string = "";
    $: {
        $projectStore.data.restraintLocations;
        $projectStore.storage.restraints;
        $projectStore.storage.objects;
        $projectStore.storage.states.data[$stateStore].interactions;
        
        component2Name = "";
        if($projectStore.data.restraintLocations.data[interactionData.components[1]] !== undefined) {
            component2Name = `(L) ${$projectStore.data.restraintLocations.data[interactionData.components[1]].name}`;
        } else if($projectStore.storage.restraints.data[interactionData.components[1]] !== undefined) {
            component2Name = `(R) ${$projectStore.storage.restraints.data[interactionData.components[1]].devName}`;
        } else if($projectStore.storage.objects.data[interactionData.components[1]] !== undefined) {
            component2Name = `(O) ${$projectStore.storage.objects.data[interactionData.components[1]].devName}`;
        }
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
        <p class="h-6 text-left w-full min-w-0 truncate">{interactionData.devName}</p>
        <div class={`flex flex-row h-5 space-x-4 text-sm ${selected === true
            ? "text-slate-400"
            : "text-slate-500"}`}>
            {#if interactionData.action !== ""}
                <p class="w-12 text-left">{actionName}</p>
                {#if component1Name !== "" || component2Name !== ""}
                    <p>|</p>
                {/if}
                <p>{component1Name} {component2Name !== "" ? `- ${component2Name}` : ""}</p>
            {/if}
        </div>
    </div>
    <div class="flex flex-row items-center h-full">
        <p class={`text-center font-mono ${selected === true
            ? "text-slate-500"
            : "text-slate-600"}`}>
            {key}
        </p>
    </div>
</div>