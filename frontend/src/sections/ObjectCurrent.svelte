<script lang="ts">
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import LabelToggle from "../components/LabelToggle.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import { projectStore } from "../miscellaneous";

    export let selectedObjectID: string;
</script>

<FormGrouping class="h-full w-full min-h-0 overlfow-y-auto">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl">Selected Object</p>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <div class="flex flex-row space-x-6">
            <LabelTextInput class="grow"
                bind:value={$projectStore.storage.objects.data[selectedObjectID].devName}
                label={"Development Name"}
                placeholder={"Button (#1, incorrect)"} />
            <LabelTextInput class="w-1/2"
                bind:value={$projectStore.storage.objects.data[selectedObjectID].name}
                label={"Name"}
                placeholder={"Button"} />
        </div>
        <LabelTextArea class="w-full" 
            bind:value={$projectStore.storage.objects.data[selectedObjectID].examine} 
            label={"Examine Description"}
            placeholder={"One of many buttons dotting the wall - feeling lucky?"}
            rows={6} />
        <LabelToggle bind:value={$projectStore.storage.objects.data[selectedObjectID].initial}
            label={"Initially Revealed"} />
    </svelte:fragment>
</FormGrouping>