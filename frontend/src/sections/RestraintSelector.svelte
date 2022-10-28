<script lang="ts">
    import RadioRestraint from "../components/RadioRestraint.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import { idLength, ProjectRestraintData, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";

    export let selectedRestraintID: string | undefined;

    let scrollingRestraintData: ScrollingRadioData[];
    function generateRestraintData(): ScrollingRadioData[] {
        return $projectStore.storage.restraints.ordering
            .filter(id => id !== undefined).map((id) => {
                const restraintData = $projectStore.storage.restraints.data[id];
                return {
                    key: restraintData.id,
                    component: RadioRestraint,
                    props: { restraintData: restraintData }
                }
            });
    }
    $: {
        $projectStore.storage.restraints;
        scrollingRestraintData = generateRestraintData();
    }

    function addRestraint() {
        const id = randomID(idLength);
        $projectStore.storage.restraints.data[id] = {
            id: id,
            devName: "",
            name: "",
            location: "",
            examine: "",
        }
        $projectStore.storage.restraints.ordering.push(id);

        $projectStore.storage.restraints = $projectStore.storage.restraints;
    }

    function copyRestraint() {
        if(selectedRestraintID !== undefined) {
            const existingRestraintIndex = $projectStore.storage.restraints.ordering.indexOf(selectedRestraintID);
            const selectedRestraintData = $projectStore.storage.restraints.data[selectedRestraintID];
            const copiedRestraintData: ProjectRestraintData = JSON.parse(JSON.stringify(selectedRestraintData));
            const copiedRestraintID = randomID(idLength);
            copiedRestraintData.id = copiedRestraintID;
            $projectStore.storage.restraints.data[copiedRestraintID] = copiedRestraintData;
            $projectStore.storage.restraints.ordering.splice(existingRestraintIndex + 1, 0, copiedRestraintID);
            // $projectStore.storage.restraints.ordering.push(copiedRestraintId);

            $projectStore.storage.restraints = $projectStore.storage.restraints;

            selectedRestraintID = copiedRestraintID;
        }
    }

    function deleteRestraint() {
        if(selectedRestraintID !== undefined) {
            const backupRestraintID = selectedRestraintID;
            selectedRestraintID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.storage.restraints.ordering;
            const locationIndex = ordering.findIndex(id => id === backupRestraintID);
            for(let index = locationIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedRestraintID = ordering[locationIndex] ?? ordering[locationIndex-1];
            // Delete restraint data from project data
            delete $projectStore.storage.restraints.data[backupRestraintID];

            $projectStore.storage.restraints = $projectStore.storage.restraints;
        }
    }

    function moveRestraintUp() {
        if(selectedRestraintID !== undefined && $projectStore.storage.restraints.ordering.length > 1) {
            const ordering = $projectStore.storage.restraints.ordering;
            const restraintIndex = ordering.findIndex(id => id === selectedRestraintID);
            if(restraintIndex <= 0) { return; }
            const tempSwap = ordering[restraintIndex];
            ordering[restraintIndex] = ordering[restraintIndex - 1]
            ordering[restraintIndex - 1] = tempSwap;

            $projectStore.storage.restraints = $projectStore.storage.restraints;
        }
    }

    function moveRestraintDown() {
        if(selectedRestraintID !== undefined && $projectStore.storage.restraints.ordering.length > 1) {
            const ordering = $projectStore.storage.restraints.ordering;
            const restraintIndex = ordering.findIndex(id => id === selectedRestraintID);
            if(restraintIndex === -1 || restraintIndex === $projectStore.storage.restraints.ordering.length - 1) { return; }
            const tempSwap = ordering[restraintIndex];
            ordering[restraintIndex] = ordering[restraintIndex + 1]
            ordering[restraintIndex + 1] = tempSwap;

            $projectStore.storage.restraints = $projectStore.storage.restraints;
        }
    }
</script>


<FormGrouping class="shrink
    w-full h-full min-h-0"
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Game Restraints</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addRestraint}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={copyRestraint}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteRestraint}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveRestraintUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveRestraintDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedRestraintID}
            deselectable={true}
            scrollingRadioData={scrollingRestraintData} />
    </svelte:fragment>
</FormGrouping>