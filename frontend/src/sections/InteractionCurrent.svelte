<script lang="ts">
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import { ChoiceData, projectStore } from "../miscellaneous";
    import LabelSelect from "../components/LabelSelect.svelte";

    export let selectedStateID: string;
    export let selectedInteractionID: string | undefined;

    let actionsChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.data.actions;
        actionsChoiceData = $projectStore.data.actions.ordering
            .map(id => {
                const data = $projectStore.data.actions.data[id];
                return { key: data.id, display: data.name, enabled: true };
            });
    }

    let componentsChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.restraints;
        $projectStore.storage.objects;
        componentsChoiceData = [
            { key: "", display: "", enabled: true},
            ...($projectStore.data.restraintLocations.ordering)
                .map(id => {
                    const data = $projectStore.data.restraintLocations.data[id];
                    return { key: data.id, display: `(L) ${data.name}`, enabled: true };
                }),
            ...($projectStore.storage.restraints.ordering)
                .map(id => {
                    const data = $projectStore.storage.restraints.data[id];
                    return { key: data.id, display: `(L) ${data.devName}`, enabled: true };
                }),
            ...($projectStore.storage.objects.ordering)
                .map(id => {
                    const data = $projectStore.storage.objects.data[id];
                    return { key: data.id, display: `(O) ${data.devName}`, enabled: true };
                }),
        ];
    }

    let componentTwoAllowed: boolean = false;
    $: {
        if($projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID] !== undefined) {
            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].action;
            const actionData = $projectStore.data.actions.data[$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].action];
            if(actionData !== undefined) {
                componentTwoAllowed = actionData.two;
            }
        }
    }

    let hasExceededAttempts: boolean;
    $: {
        // selectedStateID;
        selectedInteractionID;
        hasExceededAttempts = false;
        if($projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID] !== undefined) {
            // Iterate over interaction criteria and check whether any are exceededAttempts
            for(const criteriaID of $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering) {
                if($projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[criteriaID].type === "exceededAttempts") {
                    // Set exceeded attempts and reset action and components
                    $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].action = "";
                    $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].components = ["", ""];

                    hasExceededAttempts = true;
                    
                    break;
                }
            }
        }
    }
</script>

<div class="grow shrink
    w-full min-h-0">
    <FormGrouping class="h-full w-full min-h-0 overflow-y-auto">
        <svelte:fragment slot="header">
            <p class="text-slate-300 text-xl">Selected Interaction</p>
        </svelte:fragment>
        <svelte:fragment slot="content">
            <LabelTextInput
                bind:value={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].devName}
                label={"Development Name"}
                placeholder={"Removing wrist restraints with knife"} />
            <LabelSelect class="w-1/3" 
                label={"Targeted Action"} 
                disabled={hasExceededAttempts === true}
                choicesData={actionsChoiceData}
                bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].action} />
            <div class="flex flex-row space-x-6">
                <LabelSelect class="w-1/2" 
                    label={"Component #1"} 
                    disabled={hasExceededAttempts === true}
                    choicesData={componentsChoiceData}
                    bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].components[0]} />
                <LabelSelect class="grow" 
                    label={"Component #2"} 
                    disabled={hasExceededAttempts === true || componentTwoAllowed === false}
                    choicesData={componentsChoiceData}
                    bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].components[1]} />
            </div>
        </svelte:fragment>
    </FormGrouping>
</div>

