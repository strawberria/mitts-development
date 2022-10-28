<script lang="ts">
    import RadioObject from "../components/RadioObject.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import { idLength, ProjectObjectData, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";

    export let selectedObjectID: string | undefined;

    let scrollingObjectData: ScrollingRadioData[];
    function generateObjectData(): ScrollingRadioData[] {
        return $projectStore.storage.objects.ordering
            .filter(id => id !== undefined).map((id) => {
                const objectData = $projectStore.storage.objects.data[id];
                return {
                    key: objectData.id,
                    component: RadioObject,
                    props: { objectData: objectData }
                }
            });
    }
    $: {
        $projectStore.storage.objects;
        scrollingObjectData = generateObjectData();
    }

    function addObject() {
        const id = randomID(idLength);
        $projectStore.storage.objects.data[id] = {
            id: id,
            name: "",
            devName: "",
            examine: "",
            initial: false,
        }
        $projectStore.storage.objects.ordering.push(id);

        $projectStore.storage.objects = $projectStore.storage.objects;
    }

    function copyObject() {
        if(selectedObjectID !== undefined) {
            const existingObjectIndex = $projectStore.storage.objects.ordering.indexOf(selectedObjectID);
            const selectedObjectData = $projectStore.storage.objects.data[selectedObjectID];
            const copiedObjectData: ProjectObjectData = JSON.parse(JSON.stringify(selectedObjectData));
            const copiedObjectID = randomID(idLength);
            copiedObjectData.id = copiedObjectID;
            $projectStore.storage.objects.data[copiedObjectID] = copiedObjectData;
            $projectStore.storage.objects.ordering.splice(existingObjectIndex + 1, 0, copiedObjectID);
            // $projectStore.storage.objects.ordering.push(copiedObjectId);

            $projectStore.storage.objects = $projectStore.storage.objects;

            selectedObjectID = copiedObjectID;
        }
    }

    function deleteObject() {
        if(selectedObjectID !== undefined) {
            const backupObjectID = selectedObjectID;
            selectedObjectID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.storage.objects.ordering;
            const objectIndex = ordering.findIndex(id => id === backupObjectID);
            for(let index = objectIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedObjectID = ordering[objectIndex] ?? ordering[objectIndex-1];
            // Delete object data from project data
            delete $projectStore.storage.objects.data[backupObjectID];

            $projectStore.storage.objects = $projectStore.storage.objects;
        }
    }

    function moveObjectUp() {
        if(selectedObjectID !== undefined && $projectStore.storage.objects.ordering.length > 1) {
            const ordering = $projectStore.storage.objects.ordering;
            const objectIndex = ordering.findIndex(id => id === selectedObjectID);
            if(objectIndex <= 0) { return; }
            const tempSwap = ordering[objectIndex];
            ordering[objectIndex] = ordering[objectIndex - 1]
            ordering[objectIndex - 1] = tempSwap;

            $projectStore.storage.objects = $projectStore.storage.objects;
        }
    }

    function moveObjectDown() {
        if(selectedObjectID !== undefined && $projectStore.storage.objects.ordering.length > 1) {
            const ordering = $projectStore.storage.objects.ordering;
            const objectIndex = ordering.findIndex(id => id === selectedObjectID);
            if(objectIndex === -1 || objectIndex === $projectStore.storage.objects.ordering.length - 1) { return; }
            const tempSwap = ordering[objectIndex];
            ordering[objectIndex] = ordering[objectIndex + 1]
            ordering[objectIndex + 1] = tempSwap;

            $projectStore.storage.objects = $projectStore.storage.objects;
        }
    }
</script>


<FormGrouping class="shrink
    w-full h-full min-h-0"
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Game Objects</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addObject}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={copyObject}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteObject}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveObjectUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveObjectDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedObjectID}
            deselectable={true}
            scrollingRadioData={scrollingObjectData} />
    </svelte:fragment>
</FormGrouping>