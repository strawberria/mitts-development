<script lang="ts">
    import { LoadImage } from "../../wailsjs/go/main/Bridge";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import LabelImage from "../components/LabelImage.svelte";
    import LabelNumberInput from "../components/LabelNumberInput.svelte";
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import { ChoiceData, projectStore, StateType } from "../miscellaneous";

    export let selectedStateID: string;

    let stateTypeChoices: ChoiceData<StateType>[] = [
        { key: "normal", display: "Normal", enabled: true },
        { key: "opening", display: "Opening", enabled: true },
        { key: "starting", display: "Starting", enabled: true },
        { key: "intermediate", display: "Intermediate", enabled: true },
        { key: "ending", display: "Ending", enabled: true },
    ];
    $: {
        $projectStore.storage.states;
        stateTypeChoices[1].enabled = Object.values($projectStore.storage.states.data)
            .findIndex(d => d.type === "opening") === -1
            || $projectStore.storage.states.data[selectedStateID].type === "opening";
        stateTypeChoices[2].enabled = Object.values($projectStore.storage.states.data)
            .findIndex(d => d.type === "starting") === -1
            || $projectStore.storage.states.data[selectedStateID].type === "starting";
    }

    let stateChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.states;
        // Don't allow changing back to opening state? I dunno
        stateChoiceData = Object.values($projectStore.storage.states.data)
            // .filter(data => data.type !== "opening")
            .map(data => {
                return { key: data.id, display: data.title, enabled: true };
            });
    }

    async function loadStateImage() {
        const imageB64 = await LoadImage();
        if(imageB64.startsWith("Cancelled") === true) { return; }
        $projectStore.storage.states.data[selectedStateID].imageB64 = imageB64;

        $projectStore.storage.states = $projectStore.storage.states;
    }

    async function clearStateImage() {
        $projectStore.storage.states.data[selectedStateID].imageB64 = "";

        $projectStore.storage.states = $projectStore.storage.states;
    }
</script>

<!-- BUG: image extends width squishing other elements -->
<FormGrouping class="h-full w-full min-h-0">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl">Selected State</p>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <div class="flex flex-row space-x-6">
            <LabelTextInput class="w-3/4"
                bind:value={$projectStore.storage.states.data[selectedStateID].title}
                label={"Title"}
                placeholder={"The beginning of your peril"} />
            <LabelSelect class="w-1/4" 
                label={"State Type"} 
                choicesData={stateTypeChoices}
                bind:selected={$projectStore.storage.states.data[selectedStateID].type} />
        </div>
        <div class="flex flex-row space-x-6">
            <LabelTextArea class="w-3/5" 
                bind:value={$projectStore.storage.states.data[selectedStateID].description} 
                label={"Description"}
                placeholder={"You slowly awake within a cold, dark basement..."}
                rows={8} />
            <LabelTextArea class="grow" 
                bind:value={$projectStore.storage.states.data[selectedStateID].notes} 
                label={"Development Notes"}
                placeholder={"Goal: remove blindfold and investigate surroundings"}
                rows={8} />
        </div>
        <div class="grow flex flex-row space-x-6">
            <div class="flex flex-col space-y-2 w-1/2">
                <LabelImage label="Image" 
                    imageData={$projectStore.storage.states.data[selectedStateID].imageB64} />
                <div class="flex flex-row space-x-2">
                    <IconButton class="mt-1"
                        label={"Load Image"}
                        onclick={loadStateImage}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </IconButton>
                    <IconButton class="mt-1"
                        label={"Clear Image"}
                        onclick={clearStateImage}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </IconButton>
                </div>
            </div>
            <div class="flex flex-col space-y-2 w-1/2 p-4">
                <p class="mb-2">To disable hint, set number of (failed) attempts to -1</p>
                {#each { length: 3 } as _, hintIndex}
                    <div class="flex flex-row space-x-6 w-full">
                        <LabelNumberInput class="w-16"
                            label={`Attempts`}
                            bind:value={$projectStore.storage.states.data[selectedStateID].hints[hintIndex].attempts} />
                        <LabelTextInput class="grow"
                            label={`Hint ${hintIndex + 1} Text`}
                            placeholder={"Perhaps that key could be useful somewhere?"}
                            bind:value={$projectStore.storage.states.data[selectedStateID].hints[hintIndex].text} />
                    </div>
                {/each}
                <div class="grow" />
                {#if $projectStore.storage.states.data[selectedStateID].type === "intermediate"}
                    <LabelSelect class="w-1/2" 
                        label={"Next State"} 
                        choicesData={stateChoiceData}
                        bind:selected={$projectStore.storage.states.data[selectedStateID].args[0]} />
                {:else if $projectStore.storage.states.data[selectedStateID].type === "ending"}
                    <LabelTextInput class="w-1/2"
                        label={"Ending Line"}
                        placeholder={"Good End"}
                        bind:value={$projectStore.storage.states.data[selectedStateID].args[0]} />
                {/if}
            </div>
        </div>
    </svelte:fragment>
</FormGrouping>