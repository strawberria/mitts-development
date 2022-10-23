<script lang="ts">
    import LabelSelect from "../components/LabelSelect.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import { ChoiceData, projectStore } from "../miscellaneous";
    import LabelTextArea from "../components/LabelTextArea.svelte";

    export let selectedRestraintID: string;

    let disableLocationSelect: boolean = false;
    let locationChoiceData: ChoiceData<string>[] = [];
    $: {
        $projectStore.data.restraintLocations;
        disableLocationSelect = Object.values($projectStore.data.restraintLocations.data).length === 0;
        locationChoiceData = $projectStore.data.restraintLocations.ordering
            .map(id => {
                const data = $projectStore.data.restraintLocations.data[id];
                return { key: data.id, display: data.name, enabled: true };
            })
    }
</script>

<FormGrouping class="h-full w-full min-h-0 overlfow-y-auto">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl">Selected Restraint</p>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <LabelTextInput class="w-full"
            bind:value={$projectStore.storage.restraints.data[selectedRestraintID].devName}
            label={"Development Name"}
            placeholder={"Leather Armbinder (underneath: handcuffs)"} />
        <div class="flex flex-row space-x-6">
            <LabelTextInput class="w-3/4"
                bind:value={$projectStore.storage.restraints.data[selectedRestraintID].name}
                label={"Name"}
                placeholder={"Leather Armbinder"} />
            <LabelSelect class="w-1/4" 
                label={"Location"} 
                disabled={disableLocationSelect}
                choicesData={locationChoiceData}
                bind:selected={$projectStore.storage.restraints.data[selectedRestraintID].location} />
        </div>
        <LabelTextArea class="w-full" 
            bind:value={$projectStore.storage.restraints.data[selectedRestraintID].examine} 
            label={"Examine Description"}
            placeholder={"A pair of cold, steel handcuffs biting into your wrists."}
            rows={6} />
    </svelte:fragment>
</FormGrouping>