<script lang="ts">
    import { ChoiceData, InteractionCriteriaType, projectStore } from "../miscellaneous";
    import FormGrouping from "../components/FormGrouping.svelte";
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import LabelNumberInput from "../components/LabelNumberInput.svelte";

    export let selectedStateID: string;
    export let selectedInteractionID: string;
    export let selectedCriteriaID: string;

    let criteriaChoiceData: ChoiceData<InteractionCriteriaType>[] = [
        { key: "flagEquals", display: "Flag equals", enabled: true },
        { key: "flagNotEquals", display: "Flag doesn't equal", enabled: true },
        { key: "restraintWearing", display: "Wearing restraint", enabled: true },
        { key: "restraintNotWearing", display: "Not wearing restraint", enabled: true },
        { key: "objectFound", display: "Object found", enabled: true },
        { key: "objectNotFound", display: "Object not found", enabled: true },
        { key: "exceededAttempts", display: "Exceeded attempts", enabled: true },
    ];

    let restraintChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.restraints;
        restraintChoiceData = Object.values($projectStore.storage.restraints.data)
            .map(data => {
                return { key: data.id, display: data.devName, enabled: true };
            });
    }

    let objectChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.objects;
        objectChoiceData = Object.values($projectStore.storage.objects.data)
            .map(data => {
                return { key: data.id, display: data.devName, enabled: true };
            });
    }

    let previousCriteriaID: string;
    let criteriaType: InteractionCriteriaType;
    $: {
        selectedCriteriaID;
        if($projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID] !== undefined) {
            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].type;

            // criteriaType for convenience since the binding is so long
            // Reset fields whenever criteria type changes with same criteria
            const newValue = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].type;
            if(criteriaType !== undefined && newValue !== undefined && criteriaType !== newValue
                && previousCriteriaID === selectedCriteriaID) {
                $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].args = [];
            }
            
            criteriaType = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].type
            previousCriteriaID = selectedCriteriaID;
        }
    }
</script>

<div class="grow shrink
    w-full min-h-0">
    <FormGrouping class="h-full w-full min-h-0 overlfow-y-auto">
        <svelte:fragment slot="header">
            <p class="text-slate-300 text-xl">Selected Criteria</p>
        </svelte:fragment>
        <svelte:fragment slot="content">
            <div class="mb-4 space-y-2">
                <LabelTextInput class="w-full"
                    label={"Development Name"}
                    placeholder={"Pushed Button"}
                    bind:value={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].devName} />
                <LabelSelect class="w-1/2"
                    label={"Criteria Type"}
                    disabled={false}
                    choicesData={criteriaChoiceData}
                    bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].type} />
            </div>
            {#if criteriaType === "flagEquals" || criteriaType === "flagNotEquals"}
                <LabelTextInput class="w-1/2"
                    label={"Flag Name"}
                    placeholder={"pushedButton"}
                    bind:value={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].args[0]} />
                <LabelTextInput class="w-1/2"
                    label={`Flag Value`}
                    placeholder={"true"}
                    bind:value={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].args[1]} />
            {:else if criteriaType === "restraintWearing" || criteriaType === "restraintNotWearing"}
                <LabelSelect class="w-1/2" 
                    label={"Restraint"} 
                    disabled={false}
                    choicesData={restraintChoiceData}
                    bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].args[0]} />
            {:else if criteriaType === "objectFound" || criteriaType === "objectNotFound"}
                <LabelSelect class="w-1/2" 
                    label={"Object"} 
                    disabled={false}
                    choicesData={objectChoiceData}
                    bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].args[0]} />
            {:else if criteriaType === "exceededAttempts"}
                <LabelNumberInput class="w-1/5" 
                    label={"Attempts"} 
                    bind:value={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID].args[0]} />
            {/if}
        </svelte:fragment>
    </FormGrouping>
</div>

