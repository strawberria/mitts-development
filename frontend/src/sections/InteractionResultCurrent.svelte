<script lang="ts">
    import { ChoiceData, InteractionResultType, projectStore } from "../miscellaneous";
    import FormGrouping from "../components/FormGrouping.svelte";
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import LabelTextArea from "../components/LabelTextArea.svelte";

    export let selectedStateID: string;
    export let selectedInteractionID: string;
    export let selectedResultID: string;

    let resultChoiceData: ChoiceData<InteractionResultType>[] = [
        { key: "restraintAdd", display: "Add restraint", enabled: true },
        { key: "restraintRemove", display: "Remove restraint", enabled: true },
        { key: "objectReveal", display: "Add object", enabled: true },
        { key: "objectHide", display: "Remove object", enabled: true },
        { key: "locationAdd", display: "Add location", enabled: true },
        { key: "locationRemove", display: "Remove location", enabled: true },
        { key: "setState", display: "Set state", enabled: true },
        { key: "setFlag", display: "Set flag", enabled: true },
        { key: "popupDialog", display: "Show dialog", enabled: true },
        { key: "resetAttempts", display: "Reset attempts", enabled: true },
    ];

    let restraintChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.restraints;
        restraintChoiceData = $projectStore.storage.restraints.ordering
            .map(id => {
                const data = $projectStore.storage.restraints.data[id];
                return { key: data.id, display: data.devName, enabled: true };
            });
    }

    let objectChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.objects;
        objectChoiceData = $projectStore.storage.objects.ordering
            .map(id => {
                const data = $projectStore.storage.objects.data[id];
                return { key: data.id, display: data.devName, enabled: true };
            });
    }

    let locationChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.states;
        locationChoiceData = $projectStore.storage.states.data[selectedStateID].locations.ordering
            .map(id => {
                const data = $projectStore.storage.states.data[selectedStateID].locations.data[id];
                return { key: data.id, display: data.devName, enabled: true };
            });
    }

    let stateChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.states;
        stateChoiceData = $projectStore.storage.states.ordering
            .map(id => {
                const data = $projectStore.storage.states.data[id];
                return { key: data.id, display: data.title, enabled: true };
            });
    }

    let previousNextStateID: string | undefined = undefined;
    let nextStateLocationData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.states;
        $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID];
        if($projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID] !== undefined) {
            if(resultType === "setState") {
                if($projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0] !== previousNextStateID) {
                    previousNextStateID = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0];
                }

                const nextStateData = $projectStore.storage.states.data[previousNextStateID];
                if(nextStateData !== undefined) {
                    nextStateLocationData = [
                        { key: "", display: "", enabled: true },
                        ...nextStateData.locations.ordering
                            .map(id => {
                                const data = nextStateData.locations.data[id];
                                return { key: data.id, display: data.devName, enabled: true };
                            }),
                    ];
                } else {
                    nextStateLocationData = [{ key: "", display: "", enabled: true }];
                }
            } else {
                previousNextStateID = undefined;
            }
        }
    }

    let previousResultID: string;
    let resultType: InteractionResultType;
    $: {
        selectedResultID;
        if($projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID] !== undefined) {
            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].type;

            // resultType for convenience since the binding is so long
            // Reset fields whenever result type changes with same result
            const newValue = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].type;
            if(resultType !== undefined && newValue !== undefined && resultType !== newValue
                && previousResultID === selectedResultID) {
                $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args = [];
            }
            
            resultType = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].type
            previousResultID = selectedResultID;
        }
    }
</script>

<div class="grow shrink
    w-full min-h-0">
    <!-- Relating to an issue devName being undefined -->
    {#if $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID] !== undefined}
        <FormGrouping class="h-full w-full min-h-0 overlfow-y-auto">
            <svelte:fragment slot="header">
                <p class="text-slate-300 text-xl">Selected Result</p>
            </svelte:fragment>
            <svelte:fragment slot="content">
                <div class="mb-4 space-y-2">
                    <LabelTextInput class="w-full"
                        label={"Development Name"}
                        placeholder={"Set pushButton true"}
                        bind:value={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].devName} />
                    <LabelSelect class="w-1/2"
                        label={"Result Type"}
                        disabled={false}
                        choicesData={resultChoiceData}
                        bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].type} />
                </div>
                {#if resultType === "restraintAdd" || resultType === "restraintRemove"}
                    <LabelSelect class="w-1/2" 
                        label={"Restraint"} 
                        disabled={false}
                        choicesData={restraintChoiceData}
                            bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0]} />
                {:else if resultType === "objectReveal" || resultType === "objectHide"}
                    <LabelSelect class="w-1/2" 
                        label={"Object"} 
                        disabled={false}
                        choicesData={objectChoiceData}
                        bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0]} />
                {:else if resultType === "locationAdd" || resultType === "locationRemove"}
                    <LabelSelect class="w-1/2" 
                        label={"Minimap Location"} 
                        disabled={false}
                        choicesData={locationChoiceData}
                        bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0]} />
                {:else if resultType === "setState"}
                    <LabelSelect class="w-1/2" 
                        label={"State"} 
                        disabled={false}
                        choicesData={stateChoiceData}
                            bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0]} />
                    <LabelSelect class="w-1/2" 
                        label={"Starting Location"} 
                        disabled={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0] === undefined
                            || $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0] === ""}
                        choicesData={nextStateLocationData}
                            bind:selected={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[1]} />
                {:else if resultType === "setFlag"}
                    <LabelTextInput class="w-1/2"
                        label={"Flag Name"}
                        placeholder={"pushedButton"}
                        bind:value={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0]} />
                    <LabelTextInput class="w-1/2"
                        label={`Flag Value`}
                        placeholder={"true"}
                        bind:value={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[1]} />
                {:else if resultType === "popupDialog"}
                    <LabelTextArea class="w-full" 
                        bind:value={$projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID].args[0]} 
                        label={"Dialog Text"}
                        placeholder={"While struggling in your restraints, you fail to notice the door opening behind you..."}
                        rows={6} />
                {/if}
            </svelte:fragment>
        </FormGrouping>
    {/if}
</div>

