<script lang="ts">
    import RadioAction from "../components/RadioAction.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import { idLength, ProjectActionData, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";

    export let selectedActionID: string;

    let scrollingActionData: ScrollingRadioData[];
    function generateActionData(): ScrollingRadioData[] {
        return $projectStore.data.actions.ordering
            .filter(id => id !== undefined).map((id) => {
                const actionData = $projectStore.data.actions.data[id];
                return {
                    key: actionData.id,
                    component: RadioAction,
                    props: { actionData: actionData }
                }
            });
    }
    $: {
        $projectStore.data.actions;
        scrollingActionData = generateActionData();
    }

    function addAction() {
        const id = randomID(idLength);
        $projectStore.data.actions.data[id] = {
            id: id,
            name: "",
            verb: "",
            order: false,
            two: false,
        }
        $projectStore.data.actions.ordering.push(id);

        $projectStore.data.actions = $projectStore.data.actions;
    }

    function deleteAction() {
        if(selectedActionID !== undefined) {
            const backupActionID = selectedActionID;
            selectedActionID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.data.actions.ordering;
            const ActionIndex = ordering.findIndex(id => id === backupActionID);
            for(let index = ActionIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedActionID = ordering[ActionIndex] ?? ordering[ActionIndex-1];
            // Delete Action data from project data
            delete $projectStore.data.actions.data[backupActionID];

            $projectStore.data.actions = $projectStore.data.actions;
        }
    }

    function moveActionUp() {
        if(selectedActionID !== undefined && $projectStore.data.actions.ordering.length > 1) {
            const ordering = $projectStore.data.actions.ordering;
            const actionIndex = ordering.findIndex(id => id === selectedActionID);
            if(actionIndex <= 0) { return; }
            const tempSwap = ordering[actionIndex];
            ordering[actionIndex] = ordering[actionIndex - 1]
            ordering[actionIndex - 1] = tempSwap;

            $projectStore.data.actions = $projectStore.data.actions;
        }
    }

    function moveActionDown() {
        if(selectedActionID !== undefined && $projectStore.data.actions.ordering.length > 1) {
            const ordering = $projectStore.data.actions.ordering;
            const actionIndex = ordering.findIndex(id => id === selectedActionID);
            if(actionIndex === -1 || actionIndex === $projectStore.data.actions.ordering.length - 1) { return; }
            const tempSwap = ordering[actionIndex];
            ordering[actionIndex] = ordering[actionIndex + 1]
            ordering[actionIndex + 1] = tempSwap;

            $projectStore.data.actions = $projectStore.data.actions;
        }
    }
</script>

<FormGrouping class="shrink
    w-full h-3/5 min-h-0"
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Game Actions</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addAction}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteAction}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveActionUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveActionDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedActionID}
            deselectable={true}
            scrollingRadioData={scrollingActionData} />
    </svelte:fragment>
</FormGrouping>