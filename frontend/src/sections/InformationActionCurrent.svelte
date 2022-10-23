<script lang="ts">
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import { projectStore } from "../miscellaneous";
    import LabelToggle from "../components/LabelToggle.svelte";

    export let selectedActionID: string;
</script>

<FormGrouping class="grow shrink
    w-full min-h-0">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl">Selected Action</p>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <LabelTextInput class="w-3/4"
            bind:value={$projectStore.data.actions.data[selectedActionID].name}
            label={"Name"}
            placeholder={"Use"} />
        <LabelTextInput class="w-1/2"
            bind:value={$projectStore.data.actions.data[selectedActionID].verb}
            label={"Verb"}
            placeholder={"with"} />
        <div class="flex flex-row items-center space-x-6">
            <LabelToggle bind:value={$projectStore.data.actions.data[selectedActionID].order}
                label={"Order Matters"} />
            <LabelToggle bind:value={$projectStore.data.actions.data[selectedActionID].two}
                label={"Optional Second Argument"} />
        </div>
    </svelte:fragment>
</FormGrouping>