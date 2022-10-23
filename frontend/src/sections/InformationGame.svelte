<script lang="ts">
    import FormGrouping from "../components/FormGrouping.svelte";
    import LabelTextArea from "../components/LabelTextArea.svelte";
    import LabelTextInput from "../components/LabelTextInput.svelte";
    import { projectStore } from "../miscellaneous";
</script>

<FormGrouping class="grow w-full">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl">Game Information</p>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <LabelTextInput class="w-full"
            bind:value={$projectStore.data.information.title}
            label={"Title"}
            placeholder={"Inescapable Escape Game!"} />
        <div class="flex flex-row space-x-6">
            <LabelTextInput class="w-1/2"
                bind:value={$projectStore.data.information.author}
                label={"Author"}
                placeholder={"strawber!ria"} />
            <LabelTextInput class="grow"
                bind:value={$projectStore.data.information.version}
                label={"Version"}
                placeholder={"1.0.0"} />
        </div>
        <LabelTextArea class="h-full w-full" 
            bind:value={$projectStore.data.information.synopsis} 
            label={"Synopsis"}
            placeholder={"The most inescapable escape game there is!"}
            rows={12} />
    </svelte:fragment>
</FormGrouping>