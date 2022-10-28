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

<div class={`flex flex-col space-y-1
    rounded border
    p-2 pl-4 pr-4
    ${customClass} ${selected === true
        ? "text-slate-200 bg-slate-700 border-slate-600"
        : "text-slate-400 bg-slate-750 border-slate-700"}`}
    on:click={handleClick}
    style="width: 0px; min-width: 100%">
    <p class="w-full inline-block h-6 text-left truncate">{interactionData.devName}</p>
    <div class="flex flex-row w-full space-x-1">
        <div class="grow flex flex-col items-start w-full">
            <div class={`w-full flex flex-row space-x-4 text-sm h-10 items-center ${selected === true
                ? "text-slate-400"
                : "text-slate-500"}`}>
                {#if actionName !== ""}
                    <p class="w-12 text-left">{actionName}</p>
                    {#if component1Name !== "" || component2Name !== ""}
                        <p>|</p>
                    {/if}
                    <div class="grow flex flex-col items-start"
                        style="width: 0px; min-width: 75%">
                        <p class="w-full text-left truncate h-5">{component1Name}</p>
                        <p class="w-full text-left truncate h-5">{component2Name}</p>
                    </div>
                    <div class="grow" />
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
</div>