<script lang="ts">
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import { ChoiceData, projectStore } from "../miscellaneous";
    import LabelSelect from "../components/LabelSelect.svelte";

    export let selectedLocationID: string;

    let restraintsChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.storage.restraints;   
        restraintsChoiceData = [
            { key: "", display: "", enabled: true },
            ...Object.values($projectStore.storage.restraints.data)
                .filter(data => data.location === selectedLocationID)
                .map(data => {
                    return { key: data.id, display: `${data.devName}`, enabled: true };
                }), 
        ]
    }
</script>

<FormGrouping class="grow shrink
    w-full min-h-0"
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl">Selected Restraint Location</p>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <LabelTextInput class="w-3/4"
            label={"Name"}
            bind:value={$projectStore.data.restraintLocations.data[selectedLocationID].name}
            placeholder={"Head"} />
        <LabelSelect class="w-3/4"
            label={"Initial Restraint"}
            bind:selected={$projectStore.data.restraintLocations.data[selectedLocationID].initial}
            choicesData={restraintsChoiceData} />
    </svelte:fragment>
</FormGrouping>