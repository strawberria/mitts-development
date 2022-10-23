<script lang="ts">
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import { projectStore } from "../miscellaneous";

    export let selectedStateID: string;
    export let selectedMinimapLocationID: string | undefined;
</script>

<div class="grow shrink
    w-full min-h-0">
    <FormGrouping class="h-full w-full min-h-0 overflow-y-auto">
        <svelte:fragment slot="header">
            <p class="text-slate-300 text-xl">Selected Minimap Location</p>
        </svelte:fragment>
        <svelte:fragment slot="content">
            <div class="flex flex-row space-x-6">
                <LabelTextInput class="w-1/2"
                    bind:value={$projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].name}
                    label={"Name"}
                    placeholder={"Bedroom"} />
            </div>
        </svelte:fragment>
    </FormGrouping>
</div>
